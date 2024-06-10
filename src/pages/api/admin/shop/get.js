import admin from "../../../../../firebase/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "GETメソッド以外は許可されていません" });
  }

  const { page = 0, limit } = req.query;
  const pageNumber = parseInt(page, 10);

  try {
    const shopsCollection = admin.firestore().collection("Shops");
    const totalShopsSnapshot = await shopsCollection.get();
    const totalShops = totalShopsSnapshot.size;

    let shopsQuery = shopsCollection.orderBy("createdAt", "desc");
    if (limit) {
      const pageSize = parseInt(limit, 10);
      shopsQuery = shopsQuery.offset(pageNumber * pageSize).limit(pageSize);
    }

    const shopsSnapshot = await shopsQuery.get();
    const shops = shopsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

    res.status(200).json({ shops, totalShops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "データの取得に失敗しました" });
  }
}
