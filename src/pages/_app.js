import "@/styles/globals.css";
import { UserProvider } from "../../context/authContext";
import Header from "../../components/common/Header";
import CircleMenu from "../../components/common/CircleMenu";
import { useRouter } from "next/router";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin");

  return (
    <UserProvider>
      <ToastContainer />
      {!isAdminPage && <Header />}
      {!isAdminPage && <CircleMenu />}
      <Component {...pageProps} />
    </UserProvider>
  );
}
