import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { login, logout } from "../../../firebase/client";
import { useRouter } from "next/router";
import DefaultLoading from "../../../components/common/Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
      // サーバーサイドからのリダイレクトにセッション無効のフラグが含まれているかチェック
      if (router.query.sessionExpired === "true") {
        // セッションが無効であればログアウト処理を実行
        await logout();
      }
    };
    signOut();
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const response = await login(email, password);
      
      // ログインの成功をチェック
      if (response.success) {
        alert("ログイン成功");
        if (email !== "kizuna.oripa11@gmail.com") {
          router.push("/shop-admin/");
        } else if (email === "kizuna.oripa11@gmail.com") {
          router.push("/admin/");
        } else {
          router.push("/");
        }
      } 
      
      else {
        // ログイン失敗時のエラーメッセージを表示
        console.error(response.error);
        alert("ログイン失敗");
      }
      setIsLoading(false)
    } catch (error) {
      // 予期せぬエラーが発生した場合
      console.error(error);
      alert("エラーが発生しました");
      setIsLoading(false)
    }
  };

  return (
    <div className={styles.wrap}>
      {isLoading && <DefaultLoading />}
      <div className={styles.formContainer}>
        <h1 className={styles.title}>店舗ログイン</h1>
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>
          <div className={styles.forgot}>
            <Link href="/">
              パスワードをお忘れの場合
            </Link>
          </div>
          <button className={styles.sign} type="submit">
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
