/* eslint-disable react/prop-types */
import { Button, ConfigProvider } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function AddButton({ onClick }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#7CFC00",
            colorPrimaryHover: "#90EE90",
            colorPrimaryActive: "#4CBB17",
          },
        },
      }}
    >
      <Button
        type="primary"
        size="medium"
        shape="circle"
        icon={<PlusOutlined />}
        styles={{ backgroundColor: "green" }}
        onClick={onClick}
      ></Button>
    </ConfigProvider>
  );
}

export default AddButton;
