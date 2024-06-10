import React from "react";
import styles from './toggleButton.module.css';

const ToggleButton = ({ isChecked, onChange }) => {
  return (
    <div className={styles.toggleButton}>
      <input
        id="toggle"
        className={styles.toggleInput}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
      />
      <label htmlFor="toggle" className={styles.toggleLabel} />
    </div>
  );
};

export default ToggleButton;
