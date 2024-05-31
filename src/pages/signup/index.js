import axios from "axios";
import React, { useState } from "react";

const index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handle = async (e) => {
    e.preventDefault();
    console.log(email, password);

    const res = await axios.post("/api/auth/signup", { email, password });
    console.log(res.data);
    alert("会員登録成功");
  };
  return (
    <form onSubmit={handle}>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">登録</button>
    </form>
  );
};

export default index;
