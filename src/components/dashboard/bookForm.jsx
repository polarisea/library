/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Select, Form, InputNumber } from "antd";
import UploadImage from "../uploadImage";

import { createBook, updateBook } from "../../slices/book";
import { fetchCategories } from "../../slices/category";
import { fetchAuthors } from "../../slices/author";
import { fetchPublishers } from "../../slices/publisher";

import { BOOK_STATUS } from "../../constants";

const { TextArea } = Input;

function AddBookFrom({ closeModal, mode, book }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.book.loading);
  const categories = useSelector((state) => state.category.categories);
  const publishers = useSelector((state) => state.publisher.publishers);
  const authors = useSelector((state) => state.author.authors);
  const [cover, setCover] = useState(null);

  const initValues = useMemo(() => {
    if (mode == "edit") return book;
    return {};
  }, [book]);
  const authorOptions = useMemo(() => {
    return authors.map((author) => ({
      label: author,
      value: author,
    }));
  }, [authors]);

  const cateOptions = useMemo(() => {
    return categories.map((category) => ({
      label: category,
      value: category,
    }));
  }, [categories]);

  const publisherOptions = useMemo(() => {
    return publishers.map((publisher) => ({
      label: publisher,
      value: publisher,
    }));
  }, [publishers]);

  const statusOptions = useMemo(() => {
    return Object.values(BOOK_STATUS).map((v) => ({
      label: v.title,
      value: v.value,
    }));
  }, [BOOK_STATUS]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
    dispatch(fetchPublishers());
  }, []);

  function onSubmit(value) {
    if (mode == "add") {
      dispatch(
        createBook({
          ...value,
          cover,
        })
      );
    }
    if (mode == "edit") {
      dispatch(updateBook({ id: book._id, body: { ...value, cover } }));
    }
  }

  return (
    <div>
      <UploadImage
        setImage={setCover}
        shape="w-[7.5rem] h-[10rem]  mb-5 mx-auto"
      />
      <Form onFinish={onSubmit} initialValues={initValues}>
        <Form.Item
          name="name"
          label="Tên sách"
          rules={[{ required: true, message: "Vui lòng nhập tên sách" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="authors"
          label="Tác giả"
          rules={[{ required: true, message: "Vui lòng chọn tác giả" }]}
        >
          <Select
            mode="tags"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Chọn ít nhất một tác giả"
            virtual={false}
            maxTagCount={10}
            options={authorOptions}
            optionFilterProp={"label"}
          />
        </Form.Item>
        <Form.Item
          name="publishers"
          label="Nhà xuất bản"
          rules={[{ required: true, message: "Vui lòng chọn nhà xuất bản" }]}
        >
          <Select
            mode="tags"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Chọn nhà xuất bản"
            virtual={false}
            maxTagCount={10}
            options={publisherOptions}
            optionFilterProp={"label"}
          />
        </Form.Item>
        <Form.Item
          name="categories"
          label="Thể loại"
          rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
        >
          <Select
            mode="tags"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Chọn ít nhất một thể loại"
            virtual={false}
            maxTagCount={10}
            options={cateOptions}
            optionFilterProp={"label"}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Tình trạng"
          rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
        >
          <Select
            allowClear
            style={{
              width: "100%",
            }}
            options={statusOptions}
            placeholder="Chọn tình trạng của sách"
            virtual={false}
          />
        </Form.Item>
        <Form.Item name="lateReturnFine" label="Phí trả muộn (ngày)">
          <InputNumber
            min={0}
            style={{
              width: "100%",
            }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item name="damagedBookFine" label="Phí làm hỏng">
          <InputNumber
            min={0}
            style={{
              width: "100%",
            }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>

        <Form.Item name="description" label="Giới thiệu">
          <TextArea placeholder="Nhập giới thiệu"></TextArea>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button
              danger
              onClick={() => {
                closeModal();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm sách
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AddBookFrom;
