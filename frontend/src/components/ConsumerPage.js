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
    console.log("Scan data:", data); 

    if (data && data.text) {
      const scannedSecret = data.text.split('/').pop(); 
      console.log("Scanned secret:", scannedSecret);
      navigate(`/consumer/${scannedSecret}`);
    }
  };

  const handleError = (err) => {
    setError('Error scanning QR code. Please try again.');
    console.error(err);
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
            style={{ width: '100%' }}
          />
        </div>
      ) : (
        <p style={{ color: 'red' }}>{error || 'Waiting for camera permission...'}</p>
      )}
    </div>
  );
}

export default ConsumerPage;
