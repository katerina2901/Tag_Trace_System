// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import QrScannerWrapper from './QrScannerWrapper';
// import axios from 'axios';

// function ConsumerPage() {
//   const navigate = useNavigate();
//   const [error, setError] = useState('');
//   const [permissionGranted, setPermissionGranted] = useState(false);
//   const [showScanner, setShowScanner] = useState(false);
//   const [isScanning, setIsScanning] = useState(false); 
//   const [isLoading, setIsLoading] = useState(false);
//   const [pillInfo, setPillInfo] = useState(null);

//   useEffect(() => {
//     if (showScanner) {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           setPermissionGranted(true);
//           stream.getTracks().forEach(track => track.stop());
//         })
//         .catch((err) => {
//           setError('Error accessing camera: ' + err.message);
//           console.error('Error accessing camera:', err);
//         });
//     }
//   }, [showScanner]);

//   const handleScan = async (data) => {
//     if (!data || isScanning) return; 
//     setIsScanning(true); 
//     setIsLoading(true);

//     const url = data.text;
//     const secret = url.split('/').pop();
//     console.log('Scanned URL:', url);
//     console.log('Extracted Secret:', secret);

//     if (secret) {
//       try {
//         const response = await axios.get(`http://localhost:3001/api/pills/${secret}`);
//         setPillInfo(response.data);
//         console.log('Pill Info:', response.data);
//         setError('');
//       } catch (error) {
//         console.error('Error fetching pill info:', error);
//         setError('Error fetching pill info. Please try again.');
//       } finally {
//         setIsScanning(false); 
//         setIsLoading(false);
//       }
//     } else {
//       setError('Invalid QR code scanned. Please try again.');
//       setIsScanning(false); 
//       setIsLoading(false);
//     }
//   };

//   const handleError = (err) => {
//     setError('Error scanning QR code. Please try again.');
//     console.error(err);
//   };

//   const handleCheckPillClick = () => {
//     setShowScanner(true);
//   };

//   const handleConsumePill = async () => {
//     if (!pillInfo) return;
//     setIsLoading(true);
//     const { secret, SKU, productionDate } = pillInfo;

//     try {
//       console.log('Sending scan data to backend:', {
//         secret,
//         sku: SKU,
//         timestamp: productionDate
//       });

//       await axios.post('http://localhost:3001/api/pills/scan', {
//         secret,
//         sku: SKU,
//         timestamp: productionDate
//       });

//       navigate(`/consumer/${secret}`);
//     } catch (error) {
//       console.error('Error recording scan:', error);
//       setError('Error recording scan. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Consumer Page</h1>
//       <button onClick={handleCheckPillClick}>Check Pill</button>

//       {showScanner && (
//         <div>
//           {permissionGranted ? (
//             <div>
//               <QrScannerWrapper
//                 delay={300}
//                 onError={handleError}
//                 onScan={handleScan}
//                 style={{ width: '300px', height: '300px' }}
//               />
//               {error && <p style={{ color: 'red' }}>{error}</p>}
//             </div>
//           ) : (
//             <p style={{ color: 'red' }}>{error || 'Waiting for camera permission...'}</p>
//           )}
//         </div>
//       )}

//       {isLoading && <p>Loading...</p>}

//       {pillInfo && (
//         <div>
//           <h2>Pill Info:</h2>
//           <p><strong>SKU:</strong> {pillInfo.SKU}</p>
//           <p><strong>blockchainManufacturer:</strong> {pillInfo.blockchainManufacturer}</p>
//           <p><strong>clickhouseManufacturer:</strong> {pillInfo.clickhouseManufacturer}</p>
//           <p><strong>productionDate:</strong> {pillInfo.productionDate}</p>
//           <p><strong>status:</strong> {pillInfo.status}</p>
//           <button onClick={handleConsumePill}>Consume Pill</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ConsumerPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScannerWrapper from './QrScannerWrapper';
import axios from 'axios';

function ConsumerPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [pillInfo, setPillInfo] = useState(null);

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
    if (!data || isScanning) return; 
    setIsScanning(true); 
    setIsLoading(true);

    const url = data.text;
    const secret = url.split('/').pop();
    console.log('Scanned URL:', url);
    console.log('Extracted Secret:', secret);

    if (secret) {
      try {
        const response = await axios.get(`http://localhost:3001/api/pills/${secret}`);
        setPillInfo(response.data);
        console.log('Pill Info:', response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching pill info:', error);
        setError('Error fetching pill info. Please try again.');
      } finally {
        setIsScanning(false); 
        setIsLoading(false);
      }
    } else {
      setError('Invalid QR code scanned. Please try again.');
      setIsScanning(false); 
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    setError('Error scanning QR code. Please try again.');
    console.error(err);
  };

  const handleCheckPillClick = () => {
    setShowScanner(true);
  };

  const handleConsumePill = async () => {
    if (!pillInfo) return;
    setIsLoading(true);
    const { secret, SKU, productionDate } = pillInfo;

    try {
      console.log('Sending scan data to backend:', {
        secret,
        sku: SKU,
        timestamp: productionDate
      });

      await axios.post('http://localhost:3001/api/pills/scan', {
        secret,
        sku: SKU,
        timestamp: productionDate
      });

      navigate(`/consumer/${secret}`);
    } catch (error) {
      console.error('Error recording scan:', error);
      setError('Error recording scan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (unixTimestamp) => {
    if (!unixTimestamp || isNaN(unixTimestamp)) {
      return 'Invalid Date';
    }
    const date = new Date((unixTimestamp + 3 * 60 * 60) * 1000); 
    return date.toISOString().slice(0, 10); 
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

      {isLoading && <p>Loading...</p>}

      {pillInfo && (
        <div>
          <h2>Pill Info:</h2>
          <p><strong>Manufacturer (address):</strong> {pillInfo.blockchainManufacturer}</p>
          <p><strong>Manufacturer name:</strong> {pillInfo.clickhouseManufacturer}</p>
          <p><strong>Production Date:</strong> {formatDate(pillInfo.productionDate)}</p>
          <p><strong>Status:</strong> {pillInfo.status === 0 ? 'Not consumed' : 'Consumed'}</p>
          <button onClick={handleConsumePill}>Consume Pill</button>
        </div>
      )}
    </div>
  );
}

export default ConsumerPage;


