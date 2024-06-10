import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Loading from "../../components/common/Loading";
import { calculateDistance, getUserLocation } from "../../libs/location";

const SignUpPage = () => {
  const router = useRouter();
  const shopuid = router.query.shopuid || "";

  const [shopData, setShopData] = useState(null);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/shop/${shopuid}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setShopData(data.shop);

          // クッキーを設定するリクエスト
          await axios.post('/api/cookie/setShopUid', { shopuid });

          // ========== 緯度軽度の取得と検証 ==========
          const shopLocation = {
            lat: data.shop.latitude,
            lng: data.shop.longitude,
          };
          try {
            const userLocation = await getUserLocation();
            if (userLocation) {
              const distance = calculateDistance(shopLocation, userLocation);
              console.log("distance:", distance);
            }
          } catch (err) {
            console.error("位置情報の取得に失敗しました:", err);
            alert(err.message + err.code);
            let errorMessage;
            switch (err.code) {
              case 1:
                errorMessage =
                  "位置情報の取得が許可されていません。位置情報サービスをオンにしてください。";
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
      } finally {
        setIsLoading(false);
      }
    };

    if (shopuid) {
      fetchShopData();
    }
  }, [shopuid]);

  return (
    <div className="wrap">
      {isLoading && <Loading />}
      <h1>ガチャ飲みオンライン</h1>
      {error && <p>Error: {error}</p>}
      {locationError && <p>Error: {locationError}</p>}
      {shopData ? (
        <div>
          <p>Shop UID: {shopuid}</p>
          <p>Shop Name: {shopData.shopName}</p>
        </div>
      ) : (
        <p>店舗が見つかりません</p>
      )}
    </div>
  );
};

export default SignUpPage;
