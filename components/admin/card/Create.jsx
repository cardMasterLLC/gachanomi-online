import React, { useState, useEffect } from "react";
import styles from "./Create.module.css";
import PokemonCardForm from "./form/PokemonCardForm";
import PointOnlyCardForm from "./form/PointOnlyCardForm";
import OriginalCardForm from "./form/OriginalCardForm";
import OnePieceCardForm from "./form/OnePieceCardForm";

const Create = () => {
  const [cardType, setCardType] = useState("");

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <select name="" id="" onChange={(e) => setCardType(e.target.value)}>
          <option value="">カードの種類を選択してください</option>
          <option value="Pokemon">ポケモン</option>
          <option value="OnePiece">ワンピース</option>
          <option value="PointOnly">ポイント専用</option>
          <option value="Original">店舗オリジナル</option>
        </select>
      </div>
      <div className={styles.main}>
        {cardType === "Pokemon" && <PokemonCardForm />}
        {cardType === "OnePiece" && <OnePieceCardForm />}
        {cardType === "PointOnly" && <PointOnlyCardForm />}
        {cardType === "Original" && <OriginalCardForm />}
      </div>
    </div>
  );
};

export default Create;
