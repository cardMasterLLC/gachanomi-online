import React from "react";
import styles from "./css/DefaultButton.module.css";

const SubmitButton = ({ text }) => {
  return (
    <button type="submit" className={styles.btn}>
      {text}
    </button>
  );
};

export default SubmitButton;
