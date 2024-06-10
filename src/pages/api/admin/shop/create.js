// pages/api/auth/register.js
import admin from "../../../../../firebase/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "POSTメソッド以外は許可されていません" });
  }

  if (!req.headers.authorization) {
    return res.status(401).json({ message: "認証トークンが見つかりません" });
  }

  // Bearerトークンを抽出
  const idToken = req.headers.authorization.split(" ")[1];
  const { email, password, shopName, back, memo, latitude, longitude } =
    req.body;

  const IntLatitude = Number(latitude);
  const IntLongitude = Number(longitude);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.role || decodedToken.role !== "admin") {
      return res
        .status(403)
        .json({ message: "この操作には管理者権限が必要です" });
    }

    // ユーザーデータの準備
    const userData = {
      email: email,
      password: password,
      displayName: shopName,
    };

    // ユーザー作成
    const userRecord = await admin.auth().createUser(userData);

    // Firestoreにユーザー情報を保存
    await admin
      .firestore()
      .collection("Shops")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email: userRecord.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        shopName: userRecord.displayName,
        latitude: IntLatitude,
        longitude: IntLongitude,
        back: back,
        memo: memo,
        subscription: false,
        url: `https://gachanomi-online-erjy.vercel.app/?shopuid=${userRecord.uid}`,
      });

    //ログ
    await admin
      .firestore()
      .collection("CreateShopsLogs")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email: userRecord.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        shopName: userRecord.displayName,
        createUser: decodedToken.email,
        back: back,
        memo: memo,
        latitude: IntLatitude,
        longitude: IntLongitude,
        subscription: false,
        url: `https://gachanomi-online-erjy.vercel.app/?shopuid=${userRecord.uid}`,
      });

    // ユーザーにカスタムクレームを設定（店舗アカウント用かどうかに応じて）
    const roleClaim = "shop";
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: roleClaim,
    });

    res.status(200).send({ message: "success" }); // カスタムトークンをクライアントに送信
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
