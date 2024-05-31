import admin from "../../../../firebase/server";

export default async function handler(req, res) {
  const { shopuid } = req.query;

  if (!shopuid) {
    return res.status(400).json({ error: 'Shop UID is required' });
  }

  const db = admin.firestore()

  try {
    const shopRef = db.collection('shops').doc(shopuid);
    const doc = await shopRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const shopData = doc.data();
    return res.status(200).json({ shop: shopData });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch shop data' });
  }
}
