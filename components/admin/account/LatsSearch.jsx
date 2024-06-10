import React, { useState } from "react";
import styles from "./LatsSearch.module.css";
import axios from "axios";

const LatsSearch = ({ setLatitude, setLongitude }) => {
  const [address, setAddress] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/admin/geocode`, {
        params: { address },
      });
      const parser = new DOMParser();
      const xml = parser.parseFromString(res.data, "application/xml");
      const lat = xml.getElementsByTagName("lat")[0].textContent;
      const lng = xml.getElementsByTagName("lng")[0].textContent;
      setLatitude(lat);
      setLongitude(lng);
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  return (
    <div className={styles.wrap}>
      <input
        type="text"
        placeholder="住所 or ランドマーク名"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button type="button" onClick={handleSearch}>
        検索
      </button>
    </div>
  );
};

export default LatsSearch;
