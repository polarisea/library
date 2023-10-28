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

import { BOOK_STATUS, CONTRACTS } from "../../constants";

import { vnDate, calculateDayDifference } from "../../utils/date";

const { RangePicker } = DatePicker;

function ContractFrom({ closeModal, mode, editContract }) {
  const { notification } = App.useApp();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const userLoading = useSelector((state) => state.user.loading);
  const userLastAction = useSelector((state) => state.user.lastAction);
  const userError = useSelector((state) => state.user.error);

  const book = useSelector((state) => state.book.book);
  const bookLoading = useSelector((state) => state.book.loading);
  const bookLastAction = useSelector((state) => state.book.lastAction);
  const bookError = useSelector((state) => state.book.error);

  const contractLoading = useSelector((state) => state.contract.loading);
  const contractLastAction = useSelector((state) => state.contract.lastAction);
  const contractError = useSelector((state) => state.contract.error);

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [returnBookStatus, setReturnBookStatus] = useState({});
  const [violationCost, setViolationCost] = useState(0);

  const [isFinePaid, setIsFinePaid] = useState(false);

  const contractStatus = useMemo(() => {
    let total = 0;
    const cost = {};
    let differentDay = null;
    if (returnDate) {
      differentDay = calculateDayDifference(editContract.to, returnDate);
      if (differentDay > 0)
        total += editContract.book.lateReturnFine * differentDay;
    }
    if (returnBookStatus == 1) {
      total += editContract.book.damagedBookFine;
    }

    setViolationCost(total);
    if (total == 0 && !returnDate) return CONTRACTS.pending.value;
    if (returnDate && (total == 0 || isFinePaid)) {
      return CONTRACTS.finished.value;
    }
    return CONTRACTS.violation.value;
  }, [returnDate, returnBookStatus, isFinePaid]);

  useEffect(() => {
    dispatch(setUser());
    dispatch(setBook());
  }, []);

  useEffect(() => {
    if (mode == "edit") {
      if (Object.keys(editContract).length > 0) {
        setReturnDate(editContract.returnDate);
        setReturnBookStatus(editContract.returnBookStatus);
        setViolationCost(editContract.violationCost);
        setIsFinePaid(editContract.isFinePaid);
      }
    }
    dispatch(setUser(null));
  }, [editContract]);

  useEffect(() => {
    if (!userLoading) {
      if (userLastAction == "fetchUser") {
        if (userError) {
          notification.error({
            message: "Thông báo",
            description: "Người dùng không tồn tại",
            placement: "topRight",
          });
          return;
        }
        dispatch(setUserLastAction(null));
      }
    }
  }, [userLoading, returnBookStatus]);

  useEffect(() => {
    if (!bookLoading) {
      if (bookLastAction == "fetchBook") {
        if (bookError) {
          notification.error({
            message: "Thông báo",
            description: "Sách không tồn tại",
            placement: "topRight",
          });
        }
        dispatch(setBookLastAction(null));
      }
    }
  }, [bookLoading]);

  useEffect(() => {
    if (!contractLoading) {
      if (contractLastAction == "createContract") {
        if (contractError) {
          notification.error({
            message: "Thông báo",
            description: "Tạo hợp đồng thất bại",
            placement: "topRight",
          });
          return;
        }
        notification.success({
          message: "Thông báo",
          description: "Tạo hợp đồng thành công",
          placement: "topRight",
        });
        dispatch(setContractLastAction(null));
        dispatch(fetchContracts());
        closeModal();
      }
    }
  }, [contractLoading]);

  useEffect(() => {
    if (!bookError && mode == "add") {
      if (book) {
        if (book.count <= book.borrowedCount) {
          dispatch(setBook(null));
          notification.error({
            message: "Thông báo",
            description: "Sách không tồn tại hoặc đã cho mượn",
            placement: "topRight",
          });
        }
      }
    }
  }, [book]);

  function onSearchUser(e) {
    e.preventDefault();
    dispatch(fetchUser(e.target.value));
  }

  function onSearchBook(e) {
    e.preventDefault();
    dispatch(fetchBook(e.target.value));
  }

  function onTimeChange(value) {
    if (value) {
      const from = new Date(value[0].$d).toISOString();
      const to = new Date(value[1].$d).toISOString();
      setFrom(from);
      setTo(to);
      return;
    }

    setFrom(null);
    setTo(null);
  }

  function onSubmit() {
    console.log("On submit: ", user, book);
    if (!user) {
      notification.error({
        message: "Thông báo",
        description: "Id độc giả không hợp lệ",
        placement: "topRight",
      });
      return;
    }
    if (!book) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng chọn sách",
        placement: "topRight",
      });
      return;
    }
    if (!from || !to) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng điền thời gian ",
        placement: "topRight",
      });
      return;
    }

    dispatch(
      createContract({
        user: user._id,
        book: book._id,
        from,
        to,
        status: CONTRACTS.pending.value,
        indexedContent: `${user.name} ${book.name}`,
      })
    );
  }

  function onDateChange(value) {
    if (value) {
      setReturnDate(new Date(value.$d).toISOString());
      return;
    }
    setReturnDate(null);
  }

  function onSubmitEdit(value) {
    if (mode == "edit") {
      dispatch(
        updateContract({
          id: editContract._id,
          body: {
            isFinePaid,
            violationCost,
            returnBookStatus,
            status: contractStatus,
            returnDate,
          },
        })
      );
    }
  }

  return (
    <div>
      {mode == "add" ? (
        <Form onFinish={onSubmit}>
          <Form.Item name="user" label="Độc giả">
            <>
              <Input onPressEnter={onSearchUser} allowClear />
              <span className="text-green-600">{user?.name}</span>
              {userLoading && <LoadingOutlined />}
            </>
          </Form.Item>
          <Form.Item name="books" label="Sách">
            <Input onPressEnter={onSearchBook} allowClear />
            <span className="text-green-600">{book?.name}</span>
            {bookLoading && <LoadingOutlined />}
          </Form.Item>

          <Form.Item name="rangeTime" label="Thời gian mượn">
            <RangePicker format={vnDate} onChange={onTimeChange} showTime />
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
              <Button type="primary" htmlType="submit">
                Tạo hợp đồng
              </Button>
            </div>
          </Form.Item>
        </Form>
      ) : (
        <ConfigProvider
          theme={{
            components: {
              Form: {
                itemMarginBottom: 2,
              },
            },
          }}
        >
          <Form
            onFinish={onSubmitEdit}
            initialValues={{
              returnDate: editContract.returnDate
                ? moment(editContract.returnDate)
                : null,
            }}
          >
            <Form.Item label="Độc giả">
              <span className="font-semibold">{editContract?.user?.name}</span>
            </Form.Item>
            <Form.Item label="Sách">
              <span className="font-semibold">{editContract?.book?.name}</span>
            </Form.Item>
            <Form.Item label="Ngày mượn">
              <span className="font-semibold">{vnDate(editContract.from)}</span>
            </Form.Item>
            <Form.Item label="Ngày trả">
              <span className="font-semibold">{vnDate(editContract.to)}</span>
            </Form.Item>
            <Form.Item label="Ngày trả thực tế" name="returnDate">
              <DatePicker format={"DD/MM/YYYY"} onChange={onDateChange} />
            </Form.Item>
            <Form.Item label="Tình trạng sách" name="status" className="mt-1">
              <Select
                defaultValue={0}
                value={returnBookStatus}
                onChange={(e) => {
                  setReturnBookStatus(e);
                }}
                options={[
                  { label: "Bình thường", value: 0 },
                  { label: "Hỏng", value: 1 },
                ]}
              />
            </Form.Item>
            <Form.Item label="Tình trạng" name="status">
              <span
                className="font-semibold"
                style={{ color: CONTRACTS[contractStatus].color }}
              >
                {CONTRACTS[contractStatus]?.title}
              </span>
            </Form.Item>

            {contractStatus >= CONTRACTS.violation.value && (
              <>
                <Form.Item label="Phí phạt">
                  <span>
                    {`${violationCost}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </Form.Item>
                <Form.Item name="isFinePaid">
                  <Checkbox
                    checked={isFinePaid}
                    onChange={(value) => {
                      setIsFinePaid(value.target.checked);
                    }}
                  >
                    Ghi nhận đã nộp phạt
                  </Checkbox>
                </Form.Item>
              </>
            )}
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
        </ConfigProvider>
      )}
    </div>
  );
}

export default ContractFrom;
