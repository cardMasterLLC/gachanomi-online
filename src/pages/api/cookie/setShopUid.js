import nookies from "nookies";

export default (req, res) => {
  const { shopuid } = req.body;
  nookies.set({ req, res }, "__Shopuid", shopuid, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24,
  });
  res.status(200).json({ message: "Cookie set" });
};
