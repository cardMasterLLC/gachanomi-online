import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  getIdToken,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore";

let storage;
let auth;
let functions;
let db;

const firebaseConfig = {
  apiKey: "AIzaSyBUd6XbGJCkJQt6V3n4y46RcMmy-Y4rCns",
  authDomain: "gachanomi-online.firebaseapp.com",
  projectId: "gachanomi-online",
  storageBucket: "gachanomi-online.appspot.com",
  messagingSenderId: "273731065299",
  appId: "1:273731065299:web:52c388e0f941c9f50fcb26",
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
  storage = getStorage();
  auth = getAuth();
  functions = getFunctions();
  db = getFirestore();
}

export { storage, auth, functions, db, getIdToken };

export const login = async (email, password) => {
  try {
    // メールアドレスとパスワードでログインする
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // ユーザーのIDトークンを取得する
    const idToken = await getIdToken(userCredential.user);

    // Cookieにセッションを付与するためにサーバーへPOSTリクエストを送信する
    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }), // APIにはidTokenという名前で送信
    });

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error };
  }
};

export const logout = async () => {
  await signOut(auth);
  // セッションCookieを削除するため、Firebase SDKでなくREST APIでログアウトさせる
  await fetch("/api/auth/sessionLogout", { method: "POST" });
};
