/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";

import { Modal, Tabs, Form, Input, Button, Checkbox } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";

import LoginGoogleBtn from "./loginGoogleBtn";
import LoginFacebookBtn from "./loginFacebookBtn";

import { register, login } from "../slices/auth";

function Auth({ open: isModalOpen, setOpen: setIsModalOpen }) {
  const dispatch = useDispatch();

  const tabItems = [
    {
      key: "1",
      label: <span className="font-semibold">Đăng nhập</span>,
      children: (
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onLoginByPassword}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mât khẩu!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <span className="flex justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ mật khẩu</Checkbox>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Quên mật khẩu
              </a>
            </span>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button w-full"
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <Form.Item>
            <span className="flex justify-center gap-2">
              <LoginFacebookBtn callback={onLoginByFacebook} />
              <LoginGoogleBtn callback={onLoginByGoogle} />
            </span>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "2",
      label: <span className="font-semibold">Đăng kí</span>,
      children: (
        <Form
          name="normal_register"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onRegister}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mât khẩu!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mât khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Xác nhận lại mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <span className="flex justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ mật khẩu</Checkbox>
              </Form.Item>
            </span>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button w-full"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  function onLoginByPassword(values) {
    dispatch(
      login({
        loginMethod: "",
        body: {
          ...values,
        },
      }),
    );
  }

  function onLoginByFacebook(response) {
    if (response) {
      dispatch(
        login({
          loginMethod: "facebook",
          body: {
            fbId: response.authResponse.userID,
            accessToken: response.authResponse.accessToken,
          },
        }),
      );
    }
  }

  function onLoginByGoogle(response) {
    if (response) {
      dispatch(
        login({
          loginMethod: "google",
          body: {
            credential: response.credential,
          },
        }),
      );
    }
  }

  function onRegister(values) {
    delete values.confirm;
    dispatch(register({ body: { ...values } }));
  }

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      footer={null}
    >
      <Tabs defaultActiveKey="1" items={tabItems} centered size="large" />
    </Modal>
  );
}

export default Auth;
