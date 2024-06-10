import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Loading from "../../../common/Loading";
import styles from "./css/OriginalCardForm.module.css";
import ToggleButton from "../../../common/ToggleButton";
import SubmitButton from "../../../common/SubmitButton";

import { auth } from "../../../../firebase/client";
import { uploadImageToFirebaseStorage } from "../../../../libs/img/uploadImageToFirebaseStorage";

const OriginalCardForm = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [originalForShop, setOriginalForShop] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [cardName, setCardName] = useState("");
  const [isPointsOnly, setIsPointsOnly] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/admin/shop/get", {
        params: { limit: undefined }, // 全件取得
      });
      setShops(res.data.shops);
    } catch (error) {
      console.error("Error fetching shops data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (selectedOption) => {
    const selectedShop = shops.find(
      (shop) => shop.uid === selectedOption.value
    );
    if (selectedShop.subscription === false) {
      alert("この店舗はサブスク未加入の為、オリジナルカードは作成できません。");
      setSelectedOption(null);
      setOriginalForShop(null);
    } else {
      setSelectedOption(selectedOption);
      setOriginalForShop(selectedShop);
    }
  };

  const handleToggleChange = () => {
    setIsPointsOnly((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!cardName || !thumbnail) {
      alert("カード名と画像を入力してください。");
      return;
    }

    try {
      const idToken = await auth.currentUser.getIdToken(true);
      const thumbnailUrl = await uploadImageToFirebaseStorage(
        thumbnail,
        300,
        "Original"
      );
      const payload = {
        shopUid: originalForShop.uid, // shopのuidを追加
        cardName,
        isPointsOnly,
        thumbnail: thumbnailUrl,
      };
      await axios.post("/api/admin/card/original/create", payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      alert("カードが正常に作成されました。");
    } catch (error) {
      console.error("Error creating card:", error);
      alert("カードの作成中にエラーが発生しました。");
    }
  };

  return (
    <div className={styles.wrap}>
      {isLoading && <Loading />}
      <div className={styles.selectShop}>
        <label htmlFor="shop">店舗を選択してください</label>
        <Select
          name="shop"
          id="shop"
          value={selectedOption}
          options={shops.map((shop) => ({
            value: shop.uid,
            label: shop.shopName,
          }))}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleSelectChange}
          components={{
            IndicatorSeparator: () => null,
          }}
          placeholder="店舗を選択してください"
          styles={{
            option: (provided) => ({
              ...provided,
              color: "black",
            }),
          }}
          aria-live="off"
        />
      </div>
      {originalForShop && (
        <div className={styles.main}>
          <h2>{originalForShop.shopName}専用カード</h2>
          <form onSubmit={handleCreateCard}>
            <div className={styles.group}>
              <label htmlFor="cardName">カード名</label>
              <input
                type="text"
                id="cardName"
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="pointsOnly">ポイント専用</label>
              <ToggleButton
                isChecked={isPointsOnly}
                onChange={handleToggleChange}
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="thumbnail">画像</label>
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.preview}
                />
              )}
            </div>
            <SubmitButton text={"カードを作成"} />
          </form>
        </div>
      )}
    </div>
  );
};

export default OriginalCardForm;
