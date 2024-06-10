import Image from "next/image";
import React from "react";
import styles from "./css/Header.module.css";

const Header = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.logo}>
        <Image src={"/logo.png"} width={600} height={346} />
      </div>
    </div>
  );
};

export default Header;
