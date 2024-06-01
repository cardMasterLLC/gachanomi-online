import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Loading from "../../components/common/Loading";

const PasswordForm = dynamic(() => import("../../components/PasswordForm"), {
  ssr: false,
});

const SignUpPage = () => {
  const router = useRouter();
  const { shopuid } = router.query;
  const [shopData, setShopData] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(false);
  const [isWithinRange, setIsWithinRange] = useState(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch(`/api/shop/${shopuid}`);
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setShopData(data.shop);
          const shopLocation = { lat: data.shop.latitude, lng: data.shop.longitude };
          const userLocation = await getUserLocation();
          if (userLocation) {
            const distance = calculateDistance(shopLocation, userLocation);
            if (distance > 500) {
              alert("店舗から離れすぎ");
            } else {
              setIsWithinRange(true);
            }
            setLocation(true);
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

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const calculateDistance = (shopLocation, userLocation) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const dLat = toRad(userLocation.lat - shopLocation.lat);
    const dLng = toRad(userLocation.lng - shopLocation.lng);
    const lat1 = toRad(shopLocation.lat);
    const lat2 = toRad(userLocation.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  return (
    <div>
      {!location ? (
        <><Loading /></>
      ) : (
        <>
          {isWithinRange ? (
            <>
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
            </>
          ) : (
            <p>店舗から500メートル以内でないため、サインアップできません。</p>
          )}
        </>
      )}
    </div>
  );
};

export default SignUpPage;
