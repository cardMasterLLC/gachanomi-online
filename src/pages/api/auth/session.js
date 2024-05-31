import { setCookie } from "nookies";
import admin from "../../../../firebase/server";

const sessionApi = async (req, res) => {
  // "POST"以外は、"404 Not Found"を返す
  if (req.method !== "POST") return res.status(404).send("Not Found");
  const auth = admin.auth();

  // Tokenの有効期限
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  // セッションCookieを作成するためのIDを取得
  const { idToken } = req.body;

  // Cookieに保存するセッションIDを作成する
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

  // Cookieのオプション
  const options = {
    maxAge: expiresIn,
    // httpOnly: true,
    // secure: true,
    path: "/",
    SameSite:"Strict"
  };

  // セッションIDをCookieに設定する
  setCookie({ res }, "session", sessionCookie, options);

  console.log("ok")
  res.send(JSON.stringify({ status: "success" }));
}

export default sessionApi;
