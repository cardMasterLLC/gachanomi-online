import React from "react";
import styles from "./Sidebar.module.css";
import { logout } from "../../firebase/client";
import { useRouter } from "next/router";

const Sidebar = ({ setSelectedComponent, selectedComponent }) => {
  const router = useRouter();

  const signout = async () => {
    await logout();
    router.reload();
  };

  return (
    <div className={styles.wrap}>
      <ul>
        <li
          onClick={() => setSelectedComponent("CreateShop")}
          className={
            selectedComponent === "CreateShop" ? styles.selectedItem : ""
          }
        >
          <span>店舗アカウント作成</span>
        </li>
        <li
          onClick={() => setSelectedComponent("EditShop")}
          className={
            selectedComponent === "EditShop" ? styles.selectedItem : ""
          }
        >
          <span>店舗アカウント編集</span>
        </li>
        <li
          onClick={() => setSelectedComponent("CreateCard")}
          className={
            selectedComponent === "CreateCard" ? styles.selectedItem : ""
          }
        >
          <span>カード</span>
        </li>
        <li
          onClick={() => setSelectedComponent("CreateCommonGacha")}
          className={
            selectedComponent === "CreateCommonGacha" ? styles.selectedItem : ""
          }
        >
          <span>共通ガチャ作成</span>
        </li>
        <li
          onClick={() => setSelectedComponent("EditCommonGacha")}
          className={
            selectedComponent === "EditCommonGacha" ? styles.selectedItem : ""
          }
        >
          <span>共通ガチャ編集</span>
        </li>
        <li
          onClick={() => setSelectedComponent("AdminEarnings")}
          className={
            selectedComponent === "AdminEarnings" ? styles.selectedItem : ""
          }
        >
          <span>全体売上</span>
        </li>
        <li
          onClick={() => setSelectedComponent("ShippingRequests")}
          className={
            selectedComponent === "ShippingRequests" ? styles.selectedItem : ""
          }
        >
          <span>発送依頼</span>
        </li>
        {/* <li
          onClick={() => setSelectedComponent("CreateCard")}
          className={
            selectedComponent === "CreateCard" ? styles.selectedItem : ""
          }
        >
          <span>店舗専用景品作成</span>
        </li>
        <li
          onClick={() => setSelectedComponent("EditCard")}
          className={
            selectedComponent === "EditCard" ? styles.selectedItem : ""
          }
        >
          <span>店舗専用景品編集</span>
        </li>
        <li
          onClick={() => setSelectedComponent("CreateOnlyGacha")}
          className={
            selectedComponent === "CreateOnlyGacha" ? styles.selectedItem : ""
          }
        >
          <span>店舗専用ガチャ作成</span>
        </li>
        <li
          onClick={() => setSelectedComponent("EditOnlyGacha")}
          className={
            selectedComponent === "EditOnlyGacha" ? styles.selectedItem : ""
          }
        >
          <span>店舗専用ガチャ編集</span>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
