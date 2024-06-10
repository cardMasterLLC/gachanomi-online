import React, { useState } from "react";
import styles from "./EditModal.module.css";
import axios from "axios";
import SubmitButton from "../../common/SubmitButton";
import Loading from "../../common/Loading";
import { toast } from "react-toastify";
import LatsSearch from "./LatsSearch";
import DefaultButton from "../../common/DefaultButton";

const EditModal = ({ shop, onClose }) => {
  const [email, setEmail] = useState(shop.email);
  const [shopName, setShopName] = useState(shop.shopName);
  const [latitude, setLatitude] = useState(shop.latitude);
  const [longitude, setLongitude] = useState(shop.longitude);
  const [back, setBack] = useState(shop.back);
  const [memo, setMemo] = useState(shop.memo);

  console.log(shop);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("/api/admin/shop/update", {
        uid: shop.uid,
        email,
        shopName,
        latitude,
        longitude,
        back,
        memo,
      });
      toast.success("店舗情報の更新に成功しました");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("店舗情報の更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {isLoading && <Loading />}
        <div className={styles.latsSearch}>
          <LatsSearch setLatitude={setLatitude} setLongitude={setLongitude} />
        </div>
        <div className={styles.main}>
          <form onSubmit={handleSubmit}>
            <div className={styles.group}>
              <label htmlFor="shopName">
                店舗名<span>必須</span>
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                placeholder="テスト南店"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="email">
                メールアドレス<span>必須</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="test@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="latitude">
                緯度<span>必須</span>
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                placeholder="36.⚪︎⚪︎⚪︎"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="longitude">
                経度<span>必須</span>
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                placeholder="138.⚪︎⚪︎⚪︎"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="back">還元率</label>
              <select
                name="back"
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="5%">5%</option>
                <option value="10%">10%</option>
                <option value="15%">15%</option>
                <option value="20%">20%</option>
                <option value="25%">25%</option>
                <option value="30%">30%</option>
              </select>
            </div>
            <div className={styles.group}>
              <label htmlFor="memo">メモ</label>
              <textarea
                type="text"
                id="memo"
                name="memo"
                placeholder="営業担当：⚪︎⚪︎"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <SubmitButton text={"店舗情報を更新"} />
            <DefaultButton
              onClick={onClose}
              bg={"#ddd"}
              text={"閉じる"}
              color={"#000"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
