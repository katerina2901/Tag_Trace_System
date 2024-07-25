import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScannerWrapper from './QrScannerWrapper'; 

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
        navigate(`/consumer/${secret}`);
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