import React, { useState } from "react";
import styles from "./css/PokemonCardForm.module.css";
import SubmitButton from "../../../common/SubmitButton";
import { auth } from "../../../../firebase/client";
import axios from "axios";
import { uploadImageToFirebaseStorage } from "../../../../libs/img/uploadImageToFirebaseStorage";
import Loading from "../../../common/Loading";
import ToggleButton from "../../../common/toggleButton";

const PokemonCardForm = () => {
  const [cardName, setCardName] = useState("");
  const [descName, setDescName] = useState("");
  const [rare, setRare] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPsa, setIsPsa] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!cardName || !thumbnail) {
      alert("カード名と画像を入力してください。");
      return;
    }
    setIsLoading(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const thumbnailUrl = await uploadImageToFirebaseStorage(
        thumbnail,
        300,
        "pokemonCard"
      );
      const payload = {
        cardName,
        descName,
        rare,
        thumbnail: thumbnailUrl,
        isPsa,
      };
      await axios.post("/api/admin/card/pokemon/create", payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      alert("カードが正常に作成されました。");
    } catch (error) {
      console.error("Error creating card:", error);
      alert("カードの作成中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {isLoading && <Loading />}
      <h2>ポケモンカード作成</h2>
      <form onSubmit={handleCreateCard}>
        <div className={styles.group}>
          <label htmlFor="">カード名</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="ピカチュウ"
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">詳細名</label>
          <input
            type="text"
            value={descName}
            onChange={(e) => setDescName(e.target.value)}
            placeholder="288/SM-P"
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">レア度</label>
          <select name="" id="" onChange={(e) => setRare(e.target.value)}>
            <option value="">選択してください</option>
            <option value="C">C</option>
            <option value="R">R</option>
            <option value="RR">RR</option>
            <option value="RRR">RRR</option>
            <option value="SA">SA</option>
            <option value="SR">SR</option>
            <option value="HR">HR</option>
            <option value="UR">UR</option>
            <option value="SSR">SSR</option>
            <option value="CHR">CHR</option>
            <option value="CSR">CSR</option>
            <option value="AR">AR</option>
            <option value="SAR">SAR</option>
          </select>
        </div>
        <div className={styles.group}>
          <label htmlFor="">PSAの有無</label>
          <ToggleButton isChecked={isPsa} onChange={(e) => setIsPsa(e.target.checked)} />
        </div>
        <div className={styles.group}>
          <label htmlFor="thumbnail">画像</label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className={styles.preview} />
          )}
        </div>
        <SubmitButton text={"カードを作成"} />
      </form>
    </div>
  );
};

export default PokemonCardForm;
