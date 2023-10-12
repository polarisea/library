/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, InputNumber, Button, Select } from "antd";
import UploadImage from "../uploadImage";

import { createBook } from "../../slices/bookSlice";
import { fetchCategories } from "../../slices/categorySlice";
import { fetchAuthors } from "../../slices/authorSlice";
const { TextArea } = Input;

function AddBookFrom({ closeModal }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.book.loading);
  const categories = useSelector((state) => state.category.categories);
  const [cateOptions, setCateOptions] = useState([]);
  const authors = useSelector((state) => state.author.authors);
  const [authorOptions, setAuthorOptions] = useState([]);
  const [cover, setCover] = useState(null);
  const [name, setName] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedCates, setSelectedCates] = useState([]);
  const [description, setDescription] = useState("");
  const [count, setCount] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
  }, []);

  useEffect(() => {
    setCateOptions(
      categories.map((category) => ({
        label: category.title,
        value: category._id,
      })),
    );
  }, [categories]);

  useEffect(() => {
    setAuthorOptions(
      authors.map((author) => ({
        label: author.name,
        value: author._id,
      })),
    );
  }, [authors]);

  useEffect(() => {
    if (!loading) closeModal();
  }, [loading]);

  function onSubmit() {
    dispatch(
      createBook({
        cover,
        name,
        authors: selectedAuthors,
        categories: selectedCates,
        count,
        description,
      }),
    );
  }

  return (
    <div className="flex gap-1 flex-col">
      <span className="flex justify-center">
        <UploadImage setCover={setCover}></UploadImage>
      </span>
      <span>
        <span>Tên sách</span>
        <Input
          value={name}
          placeholder="Nhập tên sách"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Input>
      </span>
      <span>
        <span>Tác giả</span>
        <Select
          status="error"
          mode="multiple"
          defaultValue={selectedAuthors}
          allowClear
          style={{
            width: "100%",
          }}
          placeholder="Chọn ít nhất một tác giả"
          virtual={false}
          maxTagCount={10}
          onChange={(value) => {
            setSelectedAuthors(value);
          }}
          options={authorOptions}
          optionFilterProp={"label"}
        />
      </span>
      <span>
        <span>Thể loại</span>
        <Select
          mode="multiple"
          allowClear
          defaultValue={selectedCates}
          style={{
            width: "100%",
          }}
          placeholder="Chọn ít nhất một thể loại"
          virtual={false}
          maxTagCount={10}
          onChange={(value) => {
            setSelectedCates(value);
          }}
          options={cateOptions}
          optionFilterProp={"label"}
        />
      </span>
      <span className="">
        <span>Số lượng</span>
        <br />
        <InputNumber
          onChange={(value) => {
            setCount(value);
          }}
          defaultValue={count}
          min={1}
        ></InputNumber>
        <br />
      </span>
      <span>
        <span>Giới thiệu</span>
        <TextArea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
          placeholder="Nhập giới thiệu"
        ></TextArea>
      </span>
      <span className="flex gap-2 justify-end mt-5">
        <Button ghost danger onClick={closeModal}>
          Hủy
        </Button>
        <Button loading={loading} type="primary" onClick={onSubmit}>
          Thêm
        </Button>
      </span>
    </div>
  );
}

export default AddBookFrom;
