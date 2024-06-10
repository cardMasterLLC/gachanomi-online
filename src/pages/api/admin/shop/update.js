import admin from "../../../../../firebase/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "POSTメソッド以外は許可されていません" });
  }

  const { uid, email, shopName, back, memo, latitude, longitude } = req.body;
  console.log(uid, email, shopName, back, memo, latitude, longitude);
  if (!uid) {
    return res.status(400).json({ message: "UIDが必要です" });
  }

  const IntLatitude = Number(latitude);
  const IntLongitude = Number(longitude);

  try {
    // Firestoreの店舗情報を更新
    const shopRef = admin.firestore().collection("Shops").doc(uid);
    await shopRef.update({
      email: email,
      shopName: shopName,
      latitude: IntLatitude,
      longitude: IntLongitude,
      back: back,
      memo: memo,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ログの更新
    const logRef = admin.firestore().collection("CreateShopsLogs").doc(uid);
    await logRef.update({
      email: email,
      shopName: shopName,
      latitude: IntLatitude,
      longitude: IntLongitude,
      back: back,
      memo: memo,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send({ message: "更新に成功しました" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
