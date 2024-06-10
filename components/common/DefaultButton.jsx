import React from "react";
import styles from "./css/DefaultButton.module.css";

const DefaultButton = ({ text, disabled, bg, onClick, arrow, ps,color }) => {
  console.log(text, disabled, bg, onClick, arrow, ps);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{ background: `${bg}`,color:`${color}` }}
      className={styles.btn}
    >
      {ps === "left" && <span>{arrow}</span>}
      {text}
      {ps === "right" && <span>{arrow}</span>}
    </button>
  );
};

export default DefaultButton;
