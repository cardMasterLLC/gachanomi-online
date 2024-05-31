import { setCookie } from "nookies";
import admin from "../../../../firebase/server";

const sessionApi = async (req, res) => {
  // "POST"以外は、"404 Not Found"を返す
  if (req.method !== "POST") return res.status(404).send("Not Found");
  const { email, password } = req.body;

  const auth = admin.auth();

  const userRecord = await auth.createUser({
    email,
    password,
  });

  // ユーザーにカスタムクレームを設定
  const data = await auth.setCustomUserClaims(userRecord.uid, {
    role: "admin",
  });

  res.status(200).json({data})
};

export default sessionApi;
