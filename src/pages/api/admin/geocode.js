// pages/api/geocode.js
import axios from "axios";

export default async function handler(req, res) {
  const { address } = req.query;

  try {
    const response = await axios.get(`https://www.geocoding.jp/api/?q=${encodeURIComponent(address)}`);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
