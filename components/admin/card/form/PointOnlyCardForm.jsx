import React, { useState } from "react";
import styles from "./css/PokemonCardForm.module.css";
import SubmitButton from "../../../common/SubmitButton";
import { auth } from "../../../../firebase/client";
import axios from "axios";
import { uploadImageToFirebaseStorage } from "../../../../libs/img/uploadImageToFirebaseStorage";
import Loading from "../../../common/Loading";

const PointOnlyCardForm = () => {
  const [cardName, setCardName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [point, setPoint] = useState("");

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
        thumbnail: thumbnailUrl,
        point,
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
      <h2>ポイント専用カード作成</h2>
      <form onSubmit={handleCreateCard}>
        <div className={styles.group}>
          <label htmlFor="">カード名</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="300PT"
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="">ポイント</label>
          <input
            type="text"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
            placeholder="300PT"
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

export default PointOnlyCardForm;
