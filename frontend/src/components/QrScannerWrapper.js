import React from 'react';
import OriginalQrScanner from 'react-qr-scanner';

const QrScannerWrapper = ({ delay = 300, onError = () => {}, onScan = () => {}, style = { width: '300px', height: '300px' }, ...props }) => {
  return <OriginalQrScanner delay={delay} onError={onError} onScan={onScan} style={style} {...props} />;
};

export default QrScannerWrapper;
