import Link from "next/link";
import styles from "./css/CircleMenu.module.css";
import { AiOutlinePlus } from "react-icons/ai";
import { ImCoinYen } from "react-icons/im";
import { LuWalletCards } from "react-icons/lu";
import { TbReportSearch } from "react-icons/tb";
import { RiVipDiamondFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

const CircleMenu = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.menu}>
        <input type="checkbox" id="toggle" />
        <label htmlFor="toggle" className={styles.showMenu}>
          <div className={styles.btn}>
            <IoMdClose className={styles.closeBtn} />
            <AiOutlinePlus className={styles.menuBtn} />
          </div>
          <div className={styles.btn}>
            <Link href="/">
              <LuWalletCards />
              <p>カード一覧</p>
            </Link>
          </div>
          <div className={styles.btn}>
            <Link href="/">
              <RiVipDiamondFill />
              <p>VIPガチャ</p>
            </Link>
          </div>
          <div className={styles.btn}>
            <Link href="/">
              <ImCoinYen />
              <p>ポイント購入</p>
            </Link>
          </div>
          <div className={styles.btn}>
            <Link href="/about">
              <TbReportSearch />
              <p>サイト説明</p>
            </Link>
          </div>
        </label>
      </div>
    </div>
  );
};

export default CircleMenu;
