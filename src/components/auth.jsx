/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { App, Modal, Tabs, Form, Input, Button, Checkbox } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";

import LoginGoogleBtn from "./loginGoogleBtn";
import LoginFacebookBtn from "./loginFacebookBtn";

import { setLastAction, register, login } from "../slices/auth";

function Auth({ open: isModalOpen, setOpen: setIsModalOpen }) {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const lastAction = useSelector((state) => state.auth.lastAction);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "login") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Đăng nhập thất bại",
            placement: "topRight",
          });
        } else {
        }
        setLastAction(null);
      }
      if (lastAction == "register") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Đăng ký thất bại",
            placement: "topRight",
          });
        } else {
        }
        setLastAction(null);
      }
    }
  }, [loading]);

  const tabItems = useMemo(() => {
    return [
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
                loading={loading}
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
                loading={loading}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        ),
      },
    ];
  }, [loading]);

  function onLoginByPassword(values) {
    dispatch(
      login({
        loginMethod: "",
        body: {
          ...values,
        },
      })
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
            remember: true,
          },
        })
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
            remember: true,
          },
        })
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
      {/* <Tabs defaultActiveKey="1" items={tabItems} centered size="large" /> */}
      <h1 className="text-[1.25rem] font-semibold mb-5">
        Kết nối với chúng tôi bằng?
      </h1>
      <span className="flex flex-col items-center justify-center gap-2">
        <LoginFacebookBtn callback={onLoginByFacebook} />
        <LoginGoogleBtn callback={onLoginByGoogle} />
      </span>
    </Modal>
  );
}

export default Auth;
