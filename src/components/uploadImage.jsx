/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Button } from "antd";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { getBase64 } from "../utils";
import { DEFAULT_COVER_URL } from "../constants";

function UploadImage({ setCover }) {
  const [imageBase64, setImageBase64] = useState(null);

  const inputRef = useRef(null);
  function onClickInput() {
    if (imageBase64) {
      setImageBase64(null);
      return;
    }
    inputRef.current.click();
  }

  async function onFileChange(e) {
    const file = e.target.files[0];
    const imageBase64 = await getBase64(file);
    setImageBase64(imageBase64);
    setCover(imageBase64);
  }
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="invisible w-0 h-0"
        onChange={onFileChange}
      />
      <div className="w-[8rem] h-[11.2rem]  flex justify-center items-center border-dashed border-2 relative parent-tag-hover">
        <span
          className={`absolute ${imageBase64 ? "hidden child-tag-hover" : ""}`}
        >
          <Button
            onClick={onClickInput}
            danger={imageBase64}
            size="large"
            icon={imageBase64 ? <DeleteOutlined /> : <PlusCircleOutlined />}
          ></Button>
        </span>

        <img
          src={imageBase64 ? imageBase64 : DEFAULT_COVER_URL}
          alt=""
          className="w-full"
        />
      </div>
    </>
  );
}

export default UploadImage;
