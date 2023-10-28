import { useState } from "react";
import { Descriptions, ConfigProvider, Modal } from "antd";
import {
  EditOutlined,
  TagsOutlined,
  HomeOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import BookModal from "./bookModal";
import { DEFAULT_COVER_URL, BOOK_STATUS } from "../constants";
function Book({ book }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        centered={true}
        destroyOnClose={true}
        width="600"
      >
        <BookModal
          book={book}
          closeModal={() => {
            setIsModalOpen(false);
          }}
        ></BookModal>
      </Modal>
      <div
        className="w-full h-[15rem] bg-white shadow-lg p-2 flex mb-5"
        onClick={showModal}
      >
        <div className="w-[10rem] h-[14rem]    relative">
          <img
            src={book.cover ? book.cover : DEFAULT_COVER_URL}
            className="h-full w-full"
            alt=""
          />
          <span
            className="absolute w-full  text-center font-semibold text-[1rem] bottom-0 text-white"
            style={{
              backgroundColor:
                book.borrowedCount < book.count ? "green" : "red",
            }}
          >
            {book.borrowedCount < book.count ? "Sẵn sàng" : "Hết sách"}
          </span>
        </div>
        <div className="flex  flex-1 flex-col px-2 text-[1rem]">
          <p className="font-bold text-[1.25rem]">{book.name}</p>
          <p>
            <EditOutlined /> &nbsp; <span>{book.authors.join(", ")}</span>
          </p>
          <p>
            <TagsOutlined /> &nbsp; <span>{book.categories.join(", ")}</span>
          </p>
          <p>
            <HomeOutlined /> &nbsp;
            <span>{book.publishers.join(", ")}</span>
          </p>
          <p>
            <EyeOutlined /> &nbsp;
            <span>{book.contracts}</span>
          </p>
          {/* <ConfigProvider
            theme={{
              components: {
                Descriptions: {
                  itemPaddingBottom: 0,
                  titleMarginBottom: 0,
                },
              },
            }}
          >
            <Descriptions column={1} title={book.name}>
              <Descriptions.Item label="Tác giả">
                {book.authors.join(", ")}
              </Descriptions.Item>
              <Descriptions.Item label="Thể loại">
                {book.categories.join(", ")}
              </Descriptions.Item>
              <Descriptions.Item label="Nhà xuất bản">
                {book.publishers.join(", ")}
              </Descriptions.Item>
              <Descriptions.Item label="Lượt mượn: ">
                {book.contracts}
              </Descriptions.Item>

              <Descriptions.Item label="Tình trạng: ">
                {book.borrowedCount < book.count ? "Sẵn sàng" : "Hết sách"}
              </Descriptions.Item>
            </Descriptions>
          </ConfigProvider> */}
        </div>
      </div>
    </>
  );
}

export default Book;
