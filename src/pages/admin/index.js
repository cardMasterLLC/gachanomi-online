import React, { useEffect, useState } from "react";
import styles from "./admin.module.css";
import Sidebar from "../../../components/admin/Sidebar";
import { useUser } from "../../../context/authContext";
import { parseCookies } from "nookies";
import admin from "../../../firebase/server";
import Create from "../../../components/admin/account/Create";
import ListAndEdit from "../../../components/admin/account/ListAndEdit";
import CreateCard from "../../../components/admin/card/Create";
import { useRouter } from "next/router";
import { logout } from "../../../firebase/client";

const Index = () => {
  const { currentUser, authLoading } = useUser();
  const router = useRouter();

  const [selectedComponent, setSelectedComponent] = useState("CreateShop");

  useEffect(() => {
    const authCheck = async () => {
      if (authLoading) {
        return null;
      }
      if (!authLoading && !currentUser) {
        await logout();
      }
    };
    authCheck();
  }, [authLoading, currentUser]);

  return (
    <div className={styles.wrap}>
      <div className={styles.side}>
        <Sidebar
          setSelectedComponent={setSelectedComponent}
          selectedComponent={selectedComponent}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.mainHead}>
          {currentUser ? (
            currentUser.email
          ) : (
            <span style={{ color: "red" }}>※未ログイン</span>
          )}
        </div>
        {selectedComponent === "CreateShop" && <Create />}
        {selectedComponent === "EditShop" && <ListAndEdit />}
        {selectedComponent === "CreateCard" && <CreateCard />}
      </div>
    </div>
  );
};

export default Index;

export const getServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const session = cookies.session || "";

  // セッションIDを検証して、認証情報を取得する
  let decodedClaims;
  try {
    const decodedToken = await admin.auth().verifySessionCookie(session, true);
    decodedClaims = decodedToken;
  } catch (error) {
    decodedClaims = null;
  }

  // セッションが無い場合は、ログイン画面へ遷移させる
  if (!session) {
    return {
      redirect: {
        destination: "/login?sessionExpired=true",
        permanent: false,
      },
    };
  }

  // セッションはあるが、role が admin でない場合は、トップページへ遷移させる
  if (decodedClaims && decodedClaims.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // セッションもクレームも問題ない場合は、Adminページへのアクセスを許可
  return {
    props: {},
  };
};
