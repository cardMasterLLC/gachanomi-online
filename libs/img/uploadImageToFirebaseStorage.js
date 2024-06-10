//libs/uploadImageToFirebaseStorage.js

import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { storage } from "../../firebase/client";
import { resizeImage } from "./imageResizer";

export const uploadImageToFirebaseStorage = async (
  imageFile,
  maxWidth,
  kinds,
) => {
  const resizeImageBlob = await resizeImage(imageFile, maxWidth);
  // ストレージの参照を作成
  const storageRef = ref(storage, `images/${kinds}/` + imageFile.name);

  // 画像をアップロード
  await uploadBytes(storageRef, resizeImageBlob);

  // アップロードされた画像のURLを取得
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
