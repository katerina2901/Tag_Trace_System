import React, { useState } from 'react';
import axios from 'axios';
import QRCodeComponent from './QRCodeComponent';

function ManufacturerPage() {
  const [manufacturer, setManufacturer] = useState('');
  const [SKU, setSku] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [productionDate, setProductionDate] = useState('');
  const [message, setMessage] = useState('');
  const [qrCodes, setQrCodes] = useState([]);

  const handleCreatePills = async () => {
    try {
      console.log(`Sending request to create pills: manufacturer=${manufacturer}, sku=${SKU}, quantity=${quantity}, productionDate=${productionDate}`);

      const response = await axios.post('http://localhost:3001/api/pills/create', {
        manufacturer,
        SKU,
        quantity,
        productionDate
      });
      // console.log('Response:', response.data);

      setMessage(response.data.message);
      setQrCodes(response.data.secrets);
      // console.log('QR Codes:', response.data.secrets.map(secret => `http://localhost:3000/consumer/${secret}`));
    } catch (error) {
      console.error('Error creating pills:', error);
      if (error.response && error.response.data) {
        setMessage('Error creating pills: ' + error.response.data.message);
      } else {
        setMessage('Error creating pills: ' + error.message);
      }
    }
  };

  return (
    <div>
      <h1>Manufacturer Page</h1>
      <input
        value={manufacturer}
        onChange={(e) => setManufacturer(e.target.value)}
        placeholder="Enter Manufacturer Name"
      />
      <input
        value={SKU}
        onChange={(e) => setSku(e.target.value)}
        placeholder="Enter SKU"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Enter Quantity"
      />
      <input
        type="date"
        value={productionDate}
        onChange={(e) => setProductionDate(e.target.value)}
        placeholder="Enter Production Date"
      />
      <button onClick={handleCreatePills}>Create Pills</button>
      {message && <p>{message}</p>}
      <div>
        {qrCodes.map((secret, index) => (
          <QRCodeComponent key={index} secret={secret} />
        ))}
      </div>
    </div>
  );
};

export default ManufacturerPage;