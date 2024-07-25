import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScannerWrapper from './QrScannerWrapper'; 
import axios from 'axios';

function ConsumerPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (showScanner) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          setPermissionGranted(true);
          stream.getTracks().forEach(track => track.stop()); 
        })
        .catch((err) => {
          setError('Error accessing camera: ' + err.message);
          console.error('Error accessing camera:', err);
        });
    }
  }, [showScanner]);

  const handleScan = async (data) => {
    if (data) {
      const url = data.text;
      const secret = url.split('/').pop();
      console.log('Scanned URL:', url);
      console.log('Extracted Secret:', secret);

      if (secret) {
        try {
          // Fetch pill information from the backend
          const response = await axios.get(`http://localhost:3001/api/pills/${secret}`);
          const pillInfo = response.data;
          console.log('Pill Info:', pillInfo);

          // Ensure the necessary fields are present
          const SKU = pillInfo.SKU;
          const productionDate = pillInfo.productionDate;
          
          if (!SKU || !productionDate) {
            throw new Error('Incomplete pill information received from backend.');
          }

          // Log data to be sent to backend
          console.log('Sending scan data to backend:', {
            secret,
            sku: SKU,
            timestamp: productionDate
          });

          // Send the scan information to the backend to record the transaction
          await axios.post('http://localhost:3001/api/pills/scan', {
            secret,
            sku: SKU,
            timestamp: productionDate
          });

          // Navigate to the consumer page with the pill information
          navigate(`/consumer/${secret}`);
        } catch (error) {
          console.error('Error recording scan:', error);
          setError('Error recording scan. Please try again.');
        }
      } else {
        setError('Invalid QR code scanned. Please try again.');
      }
    }
  };

  const handleError = (err) => {
    setError('Error scanning QR code. Please try again.');
    console.error(err);
  };

  const handleCheckPillClick = () => {
    setShowScanner(true);
  };

  
  return (
    <div>
      <h1>Consumer Page</h1>
      <button onClick={handleCheckPillClick}>Check Pill</button>

      {showScanner && (
        <div>
          {permissionGranted ? (
            <div>
              <QrScannerWrapper
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '300px', height: '300px' }}
              />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          ) : (
            <p style={{ color: 'red' }}>{error || 'Waiting for camera permission...'}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ConsumerPage;