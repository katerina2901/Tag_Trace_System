import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

function ConsumerPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setPermissionGranted(true);
        stream.getTracks().forEach(track => track.stop()); 
      })
      .catch((err) => {
        setError('Error accessing camera: ' + err.message);
        console.error('Error accessing camera:', err);
      });
  }, []);

  const handleScan = (data) => {
    if (data) {
      console.log("Scan data:", data);
      const url = data.text;
      console.log("Scanned URL:", url);
      
      if (url.startsWith('http://localhost:3000/consumer/')) {
        const scannedSecret = url.split('/').pop();
        console.log("Scanned secret:", scannedSecret);
        navigate(`http://localhost:3000/consumer/consumer/${scannedSecret}`);
      } else {
        setError('Invalid QR code format.');
      }
    }
  };

  const handleError = (err) => {
    setError('Error scanning QR code. Please try again.');
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      <h1>Consumer Page</h1>
      {permissionGranted ? (
        <div>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      ) : (
        <p style={{ color: 'red' }}>{error || 'Waiting for camera permission...'}</p>
      )}
    </div>
  );
}

export default ConsumerPage;
