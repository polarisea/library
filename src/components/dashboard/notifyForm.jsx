/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  App,
  Input,
  Button,
  Form,
  DatePicker,
  ConfigProvider,
  Select,
  Checkbox,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import moment from "moment";

import {
  setUser,
  setLastAction as setUserLastAction,
  fetchUser,
} from "../../slices/user";

import {
  setBook,
  setLastAction as setBookLastAction,
  fetchBook,
} from "../../slices/book";

import {
  setLastAction as setContractLastAction,
  createContract,
  updateContract,
  fetchContracts,
} from "../../slices/contract";

import {
  setLastAction,
  createNotify,
  fetchNotifies,
} from "../../slices/notify";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

function NotifyFrom({ closeModal, mode, editContract }) {
  const { notification } = App.useApp();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.loading);
  const userLastAction = useSelector((state) => state.user.lastAction);
  const userError = useSelector((state) => state.user.error);

  function onSubmitEdit(values) {
    console.log(values);
    dispatch(createNotify(values));
  }
  return (
    <div>
      <Form onFinish={onSubmitEdit} initialValues={{}} layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống Tiêu đề!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống nội dung!",
            },
          ]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2 mt-5">
            <Button
              danger
              onClick={() => {
                closeModal();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default NotifyFrom;
