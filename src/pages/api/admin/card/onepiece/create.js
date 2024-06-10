import admin from "../../../../../../firebase/server";

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
  const { cardName, thumbnail,rare,cardType } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (!decodedToken.role || decodedToken.role !== "admin") {
      return res
        .status(403)
        .json({ message: "この操作には管理者権限が必要です" });
    }

    const db = admin.firestore();
    await db.runTransaction(async (transaction) => {
      const nextDocId = await getNextDocumentId(transaction, db);

      const cardRef = db.collection("Cards").doc(`${nextDocId}`);
      const logRef = db.collection("CreateCardsLogs").doc(`${nextDocId}`);

      const cardData = {
        type: "OnePiece",
        cardName,
        thumbnail,
        rare,
        cardType,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        creater: decodedToken.email,
      };

      transaction.set(cardRef, cardData);
      transaction.set(logRef, cardData);
    });

    res.status(200).send({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

async function getNextDocumentId(transaction, db) {
  const counterRef = db.collection("counters").doc("cards");
  const doc = await transaction.get(counterRef);
  if (!doc.exists || typeof doc.data().count !== "number") {
    transaction.set(counterRef, { count: 1 });
    return 1;
  } else {
    const newCount = doc.data().count + 1;
    transaction.update(counterRef, { count: newCount });
    return newCount;
  }
}
