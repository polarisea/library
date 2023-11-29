/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { App, Modal, Avatar, Button, Form, Input, DatePicker } from "antd";
import moment from "moment";

import {
  UserOutlined,
  MailFilled,
  PhoneFilled,
  EnvironmentOutlined,
  CalendarFilled,
  EditOutlined,
} from "@ant-design/icons";

import ContractHistory from "./contractHistory";

import { PICTURE_HOST, ROLES } from "../constants";

import { vnDate } from "../utils/date";
import { setLastAction, updateUser, fetchUser } from "../slices/user";
import { setUser } from "../slices/auth";
import UploadImage from "./uploadImage";

import { setOpen } from "../slices/profile";

function Profile() {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.profile.userId);
  const open = useSelector((state) => state.profile.open);
  const user = useSelector((state) => state.user.user);
  const me = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.user?.loading);
  const error = useSelector((state) => state.user?.error);
  const lastAction = useSelector((state) => state.user.lastAction);
  const [isEdit, setIsEdit] = useState(false);
  const [picture, setPicture] = useState(null);
  const [initialValues, setInitialValues] = useState({});

  const editable = useMemo(() => {
    return me && userId == me._id;
  }, [userId]);

  useEffect(() => {
    if (userId) dispatch(fetchUser(userId));
  }, [userId]);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "updateUser") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Cập nhật thông tin thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Cập nhật thông tin thành công",
            placement: "topRight",
          });
        }
        dispatch(setLastAction(null));
      }
    }
  }, [loading]);

  useEffect(() => {
    if (!editable) return;
    setInitialValues({
      ...user,
      DOB: user?.DOB ? moment(user?.DOB) : null,
    });
    if (!error) dispatch(setUser(user));
    setIsEdit(false);
    return;
  }, [user]);

  function onSubmit(values) {
    dispatch(
      updateUser({
        userId: user?._id,
        body: {
          ...values,
          picture,
          DOB: values.DOB ? new Date(values.DOB) : null,
          email: values.email != "" ? values.email : null,
        },
      })
    );
  }

  return (
    <Modal
      zIndex={1031}
      open={open}
      onCancel={() => {
        setIsEdit(false);
        dispatch(setOpen(false));
      }}
      footer={null}
      destroyOnClose={true}
    >
      {isEdit ? (
        <div>
          <UploadImage
            setImage={setPicture}
            shape="w-[10rem] h-[10rem] rounded-[5rem] mb-5 mx-auto "
            originUrl={user?.picture}
          />
          <Form
            name="edit-profile"
            onFinish={onSubmit}
            className="edit-profile-form "
            initialValues={initialValues}
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="DOB">
              <DatePicker format={vnDate} />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone">
              <Input />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button
                  danger
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col">
          <span
            className={` border-[2px] rounded-[10rem] `}
            style={{ borderColor: ROLES[user?.role]?.color }}
          >
            <Avatar
              size={90}
              src={user ? `${PICTURE_HOST}/${user?.picture}` : ""}
              icon={<UserOutlined />}
            />
          </span>
          <span className="font-semibold">{user?.name}</span>
          <span className="text-gray-400">{user?._id}</span>
          {editable && (
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => {
                setIsEdit(true);
              }}
            />
          )}
          <div className="grid grid-cols-[auto,1fr] gap-0 mt-5">
            <div className=" px-2">
              <MailFilled />
            </div>
            <div className="">{user?.email}</div>
            <div className=" px-2">
              <PhoneFilled />
            </div>
            <div className="">{user?.phone}</div>
            <div className=" px-2">
              <EnvironmentOutlined />
            </div>
            <div className="">{user?.address}</div>
            <div className=" px-2">
              <CalendarFilled />
            </div>
            <div className="">{user?.DOB && vnDate(user?.DOB)}</div>
          </div>
          <div className=" w-full">
            <p className="font-semibold w-full border-b border-gray-400">
              Lịch sử
            </p>
            <ContractHistory user={userId} removedColumns={["user"]} />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default Profile;
