import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PillInfoPage() {
  const { secret } = useParams();
  const [pillInfo, setPillInfo] = useState(null);
  const [error, setError] = useState('');

  const fetchPillInfo = async (secret) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pills/${secret}`);
      setPillInfo(response.data);
      setError('');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching pill info');
      console.error(err);
      setPillInfo(null);
    }
  };

  useEffect(() => {
    if (secret) {
      fetchPillInfo(secret);
    }
  }, [secret]);

  return (
    <div>
      <h1>Pill Information</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {pillInfo && (
        <div>
          <p><strong>Manufacturer:</strong> {pillInfo.manufacturer}</p>
          <p><strong>SKU:</strong> {pillInfo.SKU}</p>
          <p><strong>Production Date:</strong> {pillInfo.productionDate}</p>
          <p><strong>Status:</strong> {pillInfo.status === 0 ? 'Not Consumed' : 'Consumed'}</p>
        </div>
      )}
    </div>
  );
}

export default PillInfoPage;
