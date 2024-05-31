import React, { useState } from "react";
import dynamic from "next/dynamic";

const QRScanner = dynamic(() => import("./QRScanner"), {
  ssr: false,
});

const PasswordForm = () => {
  const [password, setPassword] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (data) => {
    setPassword(data);
    setShowScanner(false); // 読み込めたらカメラを閉じる
  };

  const handleOpenScanner = () => {
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  return (
    <div>
      <h2>パスワード入力</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワードを入力"
      />
      <button onClick={handleOpenScanner}>QRコードを読み取る</button>
      {showScanner && (
        <QRScanner onScan={handleScan} onClose={handleCloseScanner} />
      )}
    </div>
  );
};

export default PasswordForm;
