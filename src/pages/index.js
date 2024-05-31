import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const PasswordForm = dynamic(() => import("../../components/PasswordForm"), {
  ssr: false,
});

const SignUpPage = () => {
  const router = useRouter();
  const { shopuid } = router.query;
  const [shopData, setShopData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shopuid) {
      console.log(shopuid);
      fetch(`/api/shop/${shopuid}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setShopData(data.shop);
          }
        })
        .catch((err) => {
          setError("Failed to fetch shop data");
        });
    }
  }, [shopuid]);

  return (
    <div>
      <h1>サインアップ</h1>
      {error && <p>Error: {error}</p>}
      {shopData ? (
        <div>
          <p>Shop UID: {shopuid}</p>
          <p>Shop Name: {shopData.shopName}</p>
          {/* 他の店舗情報を表示する */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <PasswordForm />
    </div>
  );
};

export default SignUpPage;
