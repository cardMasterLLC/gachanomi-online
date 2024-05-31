import React, { useEffect, useState } from "react";
import styles from "./CreateShop.module.css";
import { useUser } from "../../../context/authContext";
import axios from "axios";
import { auth } from "../../../firebase/client";

const CreateShop = () => {
  const { currentUser, authLoading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idToken = await auth.currentUser.getIdToken(true);

    try {
      await axios.post(
        "/api/admin/shop/create",
        {
          email,
          password,
          shopName,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      alert("店舗の作成に成功しました");
      setEmail("");
      setPassword("");
      setShopName("");
    } catch (error) {
      alert("店舗の作成に失敗しました");
      console.error(error);
    }
  };

  return (
    <div className={styles.wrap}>
      <h2>店舗アカウント作成</h2>
      <div className={styles.main}>
        <form onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label htmlFor="shopName">店舗名</label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              placeholder="テスト南店"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="test@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label htmlFor="password">パスワード</label>
            <input
              type="text"
              id="password"
              name="password"
              placeholder="6文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">作成</button>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
