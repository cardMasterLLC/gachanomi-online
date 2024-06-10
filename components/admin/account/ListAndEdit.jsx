import React, { useState, useEffect } from "react";
import styles from "./ListAndEdit.module.css";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import EditModal from "./EditModal";
import Loading from "../../common/Loading";

const ListAndEdit = () => {
  const [shops, setShops] = useState([]);
  const [totalShops, setTotalShops] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedShop, setSelectedShop] = useState(null);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

  const fetchShops = async (page) => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/admin/shop/get", {
        params: { page, limit: itemsPerPage },
      });
      setShops(res.data.shops);
      setTotalShops(res.data.totalShops);
    } catch (error) {
      console.error("Error fetching shops data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < totalShops) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEditClick = (shop) => {
    setSelectedShop(shop);
  };

  const handleCloseModal = () => {
    setSelectedShop(null);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("ja-JP");
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <div className={styles.wrap}>
      {isLoading && <Loading />}
      <h2>店舗一覧/編集</h2>
      <div className={styles.main}>
        <div className={styles.head}>
          <ul>
            <li>店舗名</li>
            <li>email</li>
            <li>作成日</li>
            <li>サブスク</li>
          </ul>
        </div>
        <div className={styles.shopsContainer}>
          {shops.map((shop, index) => (
            <ul
              key={shop.uid}
              className={`${styles.shops} ${
                index % 2 === 1 ? styles.bgRed : ""
              }`}
            >
              <span
                className={styles.bsThreeDotsVertical}
                onClick={() => handleEditClick(shop)}
              >
                <BsThreeDotsVertical />
              </span>
              <li>{shop.shopName}</li>
              <li>{shop.email}</li>
              <li>{formatTimestamp(shop.createdAt)}</li>
              <li>{shop.subscription ? "有" : "無"}</li>
            </ul>
          ))}
        </div>
        <div className={styles.pagination}>
          <div className={styles.paginationBtns}>
            <FaArrowAltCircleLeft
              onClick={handlePreviousPage}
              className={currentPage === 0 ? styles.disabled : ""}
            />
            <FaArrowAltCircleRight
              onClick={handleNextPage}
              className={endIndex >= totalShops ? styles.disabled : ""}
            />
          </div>
          <span>
            {startIndex + 1} - {Math.min(endIndex, totalShops)} / {totalShops}
          </span>
        </div>
        {selectedShop && (
          <div className={styles.editModal}>
            <EditModal shop={selectedShop} onClose={handleCloseModal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListAndEdit;
