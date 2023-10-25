import { useState } from "react";
import { Descriptions, ConfigProvider, Modal } from "antd";
/* eslint-disable react/prop-types */
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
        className="w-full h-[15rem] bg-white p-2 flex mb-2"
        onClick={showModal}
      >
        <div className="w-[10rem] h-[14rem]">
          <img
            src={book.cover ? book.cover : DEFAULT_COVER_URL}
            className="h-full"
            alt=""
          />
        </div>
        <div className="flex  flex-1 flex-col px-2 ">
          <ConfigProvider
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
                {
                  <span style={{ color: BOOK_STATUS[book.status].color }}>
                    {BOOK_STATUS[book.status].title}
                  </span>
                }
              </Descriptions.Item>
            </Descriptions>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default Book;
