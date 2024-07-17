import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeComponent = ({ secret }) => {
  const qrValue = `http://localhost:3000/consumer/${secret}`;

  return (
    <div>
      <QRCode value={qrValue} />
      <p>{qrValue}</p>
    </div>
  );
};

export default QRCodeComponent;
