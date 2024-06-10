import React, { useState } from "react";
import styles from "./CreateShop.module.css";
import { auth } from "../../../firebase/client";
import axios from "axios";
import SubmitButton from "../../common/SubmitButton";
import Loading from "../../common/Loading";
import { toast } from "react-toastify";
import LatsSearch from "./LatsSearch";

const Create = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [back, setBack] = useState("");
  const [memo, setMemo] = useState("");

  const [isLoading, setIsloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);

    const idToken = await auth.currentUser.getIdToken(true);

    try {
      await axios.post(
        "/api/admin/shop/create",
        {
          email,
          password,
          shopName,
          latitude,
          longitude,
          back,
          memo,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      toast.success("店舗の作成に成功しました");
      setEmail("");
      setPassword("");
      setShopName("");
      setLatitude("");
      setLongitude("");
      setBack("");
      setMemo("");
    } catch (error) {
      toast.error("店舗の作成に失敗しました");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {isLoading && <Loading />}
      <div className={styles.latsSearch}>
        <LatsSearch setLatitude={setLatitude} setLongitude={setLongitude} />
      </div>
      <h2>店舗アカウント作成</h2>
      <div className={styles.main}>
        <form onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label htmlFor="shopName">店舗名<span>必須</span></label>
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
            <label htmlFor="email">メールアドレス<span>必須</span></label>
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
            <label htmlFor="password">パスワード<span>必須</span></label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="6文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.group}>
            <label htmlFor="latitude">緯度<span>必須</span></label>
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
            <label htmlFor="longitude">経度<span>必須</span></label>
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
          <SubmitButton text={"店舗を作成"} />
        </form>
      </div>
    </div>
  );
};

export default Create;
