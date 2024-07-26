import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PillInfoPage() {
  const {secret} = useParams();
  const [pillInfo, setPillInfo] = useState(null);
  const [clickhouseInfo, setclickhouseInfo] = useState(null);
  const [error, setError] = useState('');

  const fetchPillInfo = async (secret) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/pills/${secret}`);
        console.log('Pill Info:', response.data);
        
        setPillInfo(response.data);
        setclickhouseInfo(response.data);
        setError('');
    } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching pill info');
        console.error(err);
        setPillInfo(null);
        setclickhouseInfo(null);
    }
  };
  
  useEffect(() => {
    if (secret) {
        fetchPillInfo(secret);
    }
  }, [secret]);

  useEffect(() => {
    const scanPill = async () => {
      if (!pillInfo || !pillInfo.productionSequence || !pillInfo.SKU || !pillInfo.productionDate) {
        // setError('Incomplete pill information');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3001/api/scan', {
            secret,
            productionSequence: pillInfo.productionSequence,
            sku: pillInfo.SKU,
            timestamp: pillInfo.productionDate
        });
        console.log('Scan response:', response.data);
      } catch (err) {
        console.error('Error scanning pill:', err);
        setError('Error scanning pill');
      }
    };

    if (secret) {
        scanPill();
    }
  }, [secret, pillInfo]);

  const formatDate = (unixTimestamp) => {
    if (!unixTimestamp || isNaN(unixTimestamp)) {
      return 'Invalid Date';
    }
    const date = new Date((unixTimestamp +3 *60 *60 ) * 1000); 
    return date.toISOString().slice(0, 10); // Format date to ISO format YYYY-MM-DD
  };

  return (
    <div>
      <h1>Pill Information</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pillInfo && (
        <div>
          <p><strong>Manufacturer (address):</strong> {pillInfo.blockchainManufacturer}</p>
          <p><strong>Manufacturer name:</strong> {clickhouseInfo.clickhouseManufacturer}</p>
          <p><strong>Production Date:</strong> {formatDate(pillInfo.productionDate)}</p>
          <p><strong>Status:</strong> {pillInfo.status === 0 ? 'Not Consumed' : 'Consumed'}</p>
          {/* <p><strong>Consumed By:</strong> {pillInfo.consumedBy}</p> */}
        </div>
      )}
    </div>
  );
}

export default PillInfoPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// function PillInfoPage() {
//   const { secret } = useParams();
//   const [pillInfo, setPillInfo] = useState(null);
//   const [clickhouseInfo, setClickhouseInfo] = useState(null);
//   const [error, setError] = useState('');

//   const fetchPillInfo = async (secret) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/pills/${secret}`);
//       console.log('Pill Info:', response.data);
//       setPillInfo(response.data);
//       setClickhouseInfo(response.data);
//       setError('');
//     } catch (err) {
//       setError(err.response ? err.response.data.message : 'Error fetching pill info');
//       console.error(err);
//       setPillInfo(null);
//       setClickhouseInfo(null);
//     }
//   };

//   useEffect(() => {
//     if (secret) {
//       fetchPillInfo(secret);
//     }
//   }, [secret]);

//   const formatDate = (unixTimestamp) => {
//     if (!unixTimestamp || isNaN(unixTimestamp)) {
//       return 'Invalid Date';
//     }
//     const date = new Date((unixTimestamp + 3 * 60 * 60) * 1000); 
//     return date.toISOString().slice(0, 10); // Format date to ISO format YYYY-MM-DD
//   };

//   return (
//     <div>
//       <h1>Pill Information</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {pillInfo && clickhouseInfo && (
//         <div>
//           <p><strong>Manufacturer (address):</strong> {pillInfo.blockchainManufacturer}</p>
//           <p><strong>Manufacturer name:</strong> {clickhouseInfo.manufacturer}</p>
//           <p><strong>Production Date:</strong> {formatDate(pillInfo.productionDate)}</p>
//           <p><strong>Status:</strong> {pillInfo.status === 0 ? 'Not Consumed' : 'Consumed'}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PillInfoPage;
