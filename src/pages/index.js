import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loading from "../../components/common/Loading";
import { calculateDistance, getUserLocation } from "../../libs/location";

const SignUpPage = () => {
  const router = useRouter();
  const { shopuid } = router.query;
  const [shopData, setShopData] = useState(null);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch(`/api/shop/${shopuid}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setShopData(data.shop);
          // ========== 緯度軽度の取得と検証 ==========
          const shopLocation = {
            lat: data.shop.latitude,
            lng: data.shop.longitude,
          };
          try {
            console.log("start");
            const userLocation = await getUserLocation();
            console.log("userLocation：", userLocation);
            if (userLocation) {
              const distance = calculateDistance(shopLocation, userLocation);
              console.log("distance:", distance);
            }
          } catch (err) {
            console.error("位置情報の取得に失敗しました:", err);
            let errorMessage;
            switch (err.code) {
              case 1:
                errorMessage = "位置情報の取得が許可されていません。位置情報サービスをオンにしてください。";
                break;
              case 2:
                errorMessage = "位置情報が利用できません。";
                break;
              case 3:
                errorMessage = "位置情報の取得にタイムアウトしました。";
                break;
              default:
                errorMessage = `位置情報の取得に失敗しました: ${err.message}`;
                break;
            }
            setLocationError(errorMessage);
          }
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch shop data");
      }
    };

    if (shopuid) {
      fetchShopData();
    }
  }, [shopuid]);

  return (
    <>
      <h1>サインアップ</h1>
      {error && <p>Error: {error}</p>}
      {locationError && <p>Error: {locationError}</p>}
      {shopData ? (
        <div>
          <p>Shop UID: {shopuid}</p>
          <p>Shop Name: {shopData.shopName}</p>
          {/* 他の店舗情報を表示する */}
        </div>
      ) : (
        !locationError && <Loading />
      )}
    </>
  );
};

export default SignUpPage;
