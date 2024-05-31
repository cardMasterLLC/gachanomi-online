import React from "react";
import styles from "./css/Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loading;
