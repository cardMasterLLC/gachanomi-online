import React, { useEffect, useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QRScanner = ({ onScan, onClose }) => {
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
    }
  }, []);

  const handleScan = data => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = err => {
    console.error(err);
    setError('カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。');
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      {isSupported ? (
        <>
          <QrScanner
            delay={300}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
            constraints={{ video: { facingMode: 'environment' }, audio: false }}
          />
          {error && <p>{error}</p>}
          <button onClick={onClose}>カメラを閉じる</button>
        </>
      ) : (
        <p>お使いのデバイスではカメラ機能がサポートされていません。</p>
      )}
    </div>
  );
};

export default QRScanner;
