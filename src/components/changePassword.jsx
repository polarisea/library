/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { App, Modal, Button, Form, Input } from "antd";

import { setLastAction, changePassword } from "../slices/auth";

function ChangePassword({ open: isModalOpen, setOpen: setIsModalOpen }) {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const lastAction = useSelector((state) => state.auth.lastAction);
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "changePassword") {
        if (error) {
          notification.error({
            message: "Lỗi",
            description: "Đổi mật khẩu thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Đổi mật khẩu thành công",
            placement: "topRight",
          });
          setIsModalOpen(false);
        }
        dispatch(setLastAction(null));
      }
    }
  }, [loading]);

  function onSubmit(values) {
    dispatch(changePassword(values));
  }

  return (
    <Modal
      zIndex={1031}
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      footer={null}
    >
      <Form onFinish={onSubmit}>
        <Form.Item>
          <span className=" font-semibold text-[1.75rem] ">Đổi mật khẩu</span>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu cũ!",
            },
          ]}
          label="Mật khẩu cũ"
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end">
            <Button
              htmlType="submit"
              className="login-form-button"
              type="primary"
              loading={loading}
            >
              Xác nhận
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangePassword;
