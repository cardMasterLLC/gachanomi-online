import React, { useState } from "react";
import styles from "./css/PokemonCardForm.module.css";
import SubmitButton from "../../../common/SubmitButton";
import { auth } from "../../../../firebase/client";
import axios from "axios";
import { uploadImageToFirebaseStorage } from "../../../../libs/img/uploadImageToFirebaseStorage";
import Loading from "../../../common/Loading";
import ToggleButton from "../../../common/ToggleButton";

const OnePieceCardForm = () => {
  const [cardName, setCardName] = useState("");
  const [rare, setRare] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardType, setCardType] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCardTypeChange = (type) => {
    setCardType(cardType === type ? "" : type);
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
        "OnePiece"
      );
      const payload = {
        cardName,
        rare,
        thumbnail: thumbnailUrl,
        cardType,
      };
      await axios.post("/api/admin/card/onepiece/create", payload, {
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
      <h2>ワンピースカード作成</h2>
      <form onSubmit={handleCreateCard}>
        <div className={styles.group}>
          <label htmlFor="">カード名</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="モンキー・D・ルフィ(ニカルフィ)"
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">レア度</label>
          <select name="" id="" onChange={(e) => setRare(e.target.value)}>
            <option value="">選択してください</option>
            <option value="シークレットレア">シークレットレア</option>
            <option value="スーパーレア">スーパーレア</option>
            <option value="リーダーカード">リーダーカード</option>
            <option value="レア">レア</option>
            <option value="アンコモン">アンコモン</option>
            <option value="コモン">コモン</option>
          </select>
        </div>
        <div className={styles.group}>
          <label htmlFor="">パラレル</label>
          <ToggleButton
            isChecked={cardType === "パラレル"}
            onChange={() => handleCardTypeChange("パラレル")}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">スーパーパラレル</label>
          <ToggleButton
            isChecked={cardType === "スーパーパラレル"}
            onChange={() => handleCardTypeChange("スーパーパラレル")}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">スペシャルカード</label>
          <ToggleButton
            isChecked={cardType === "スペシャルカード"}
            onChange={() => handleCardTypeChange("スペシャルカード")}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">アートパラレル</label>
          <ToggleButton
            isChecked={cardType === "アートパラレル"}
            onChange={() => handleCardTypeChange("アートパラレル")}
          />
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

export default OnePieceCardForm;
