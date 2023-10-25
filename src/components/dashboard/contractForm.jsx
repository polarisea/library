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
  setLastAction as setBookLastAction,
  fetchBook,
} from "../../slices/book";

import {
  setLastAction as setContractLastAction,
  createContract,
  updateContract,
  fetchContracts,
} from "../../slices/contract";

import { BOOK_STATUS, CONTRACT_STATUS } from "../../constants";

import { vnDate, calculateDayDifference } from "../../utils/date";
import { moneyFormat } from "../../utils";

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

  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookId, setBookId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [returnBookStatus, setReturnBookStatus] = useState({});
  const [violationCost, setViolationCost] = useState({});

  const [violationCostTotal, setViolationCostTotal] = useState(0);
  const [isFinePaid, setIsFinePaid] = useState(false);

  const contractStatus = useMemo(() => {
    let total = 0;
    const cost = {};
    let differentDay = null;
    if (returnDate) {
      differentDay = calculateDayDifference(editContract.to, returnDate) + 1;
    }
    for (const k in editContract.books) {
      const b = editContract.books[k];
      cost[b._id] = {
        lateReturnFine: 0,
        damagedBookFine: 0,
      };
      if (returnDate && differentDay > 0) {
        cost[b._id].lateReturnFine = differentDay * b.lateReturnFine;
        total += cost[b._id].lateReturnFine;
      }

      if (
        returnBookStatus &&
        b.status != returnBookStatus[b._id] &&
        returnBookStatus[b._id] == BOOK_STATUS.broken.value
      ) {
        total += b.damagedBookFine;
        cost[b._id].damagedBookFine = b.damagedBookFine;
      }
    }
    setViolationCost(cost);
    setViolationCostTotal(total);
    if (total == 0 && !returnDate) return CONTRACT_STATUS.pending.value;
    if (returnDate && (total == 0 || isFinePaid)) {
      return CONTRACT_STATUS.finished.value;
    }
    return CONTRACT_STATUS.violation.value;
  }, [returnDate, returnBookStatus, isFinePaid]);

  useEffect(() => {
    if (!contractLoading) {
      if (contractLastAction == "updateContract") {
        if (contractError) {
          notification.error({
            message: "Thông báo",
            description: "Trả sách thất bại",
            placement: "topRight",
          });
          return;
        }
        notification.success({
          message: "Thông báo",
          description: "Trả sách thành công",
          placement: "topRight",
        });
        dispatch(setContractLastAction(null));
        dispatch(fetchContracts());
        closeModal();
      }
    }
  }, [contractLoading]);

  useEffect(() => {
    if (mode == "edit") {
      setReturnDate(editContract.returnDate);
      if (Object.keys(editContract).length > 0) {
        const violationCost = {};

        for (const k in editContract.returnBookStatus) {
          violationCost[k] = {
            lateReturnFine: 0,
            damagedBookFine: 0,
          };
        }
        setReturnBookStatus(editContract.returnBookStatus);
        setViolationCost(violationCost);
      }
      setIsFinePaid(editContract.isFinePaid);
      return;
    }
    dispatch(setUser(null));
    setSelectedBooks([]);
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
        if (book.borrowedBook != 0) {
          notification.error({
            message: "Thông báo",
            description: "Sách không tồn tại hoặc đã cho mượn",
            placement: "topRight",
          });
          return;
        }
        setSelectedBooks([
          ...selectedBooks,
          {
            _id: book?._id,
            name: book?.name,
            status: book?.status,
            lateReturnFine: book?.lateReturnFine,
            damagedBookFine: book?.damagedBookFine,
          },
        ]);

        setBookId(null);
        return;
      }
    }
  }, [book]);

  const bookTags = useMemo(() => {
    return selectedBooks;
  }, [selectedBooks]);

  function onSearchUser(e) {
    e.preventDefault();
    dispatch(fetchUser(e.target.value));
  }

  function onSearchBook(e) {
    e.preventDefault();
    if (selectedBooks.every((v) => v._id != e.target.value)) {
      dispatch(fetchBook(e.target.value));
      return;
    } else {
      notification.error({
        message: "Thông báo",
        description: "Sách đã được thêm",
        placement: "topRight",
      });
    }
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

  function removeBook(id) {
    setSelectedBooks(selectedBooks.filter((v) => v._id != id));
  }

  function onSubmit() {
    if (!user) {
      notification.error({
        message: "Thông báo",
        description: "Id độc giả không hợp lệ",
        placement: "topRight",
      });
      return;
    }
    if (selectedBooks.length == 0) {
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
        user: userId,
        books: selectedBooks,
        from,
        to,
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

  function onBookStatusChange({ bookId, value }) {
    setReturnBookStatus({ ...returnBookStatus, [bookId]: value });
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
              <Input
                onPressEnter={onSearchUser}
                allowClear
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <span className="text-green-600">{user?.name}</span>
              {userLoading && <LoadingOutlined />}
            </>
          </Form.Item>
          <Form.Item name="books" label="Sách">
            <Input
              onPressEnter={onSearchBook}
              allowClear
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
            />
            <div className="mt-1 flex flex-wrap gap-1">
              {bookTags?.map((v, i) => (
                <span
                  key={i}
                  onClick={() => {
                    removeBook(v._id);
                  }}
                  className={`border-[1px] text-[12px] border-gray-200 block px-2 rounded   cursor-pointer hover:bg-red-400 hover:text-white  `}
                  style={{
                    color: BOOK_STATUS[v.status].color,
                  }}
                >
                  {v.name}
                </span>
              ))}
              {bookLoading && <LoadingOutlined />}
            </div>
          </Form.Item>

          <Form.Item name="rangeTime" label="Thời gian mượn">
            <RangePicker format={vnDate} onChange={onTimeChange} />
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
                itemMarginBottom: 0,
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
            <Form.Item label="Ngày mượn">
              <span className="font-semibold">{vnDate(editContract.from)}</span>
            </Form.Item>
            <Form.Item label="Ngày trả">
              <span className="font-semibold">{vnDate(editContract.to)}</span>
            </Form.Item>
            <Form.Item label="Ngày trả thực tế" name="returnDate">
              <DatePicker format={"DD/MM/YYYY"} onChange={onDateChange} />
            </Form.Item>
            <Form.Item label="Tình trạng" name="status">
              <span
                className="font-semibold"
                style={{ color: CONTRACT_STATUS[contractStatus].color }}
              >
                {CONTRACT_STATUS[contractStatus]?.title}
              </span>
            </Form.Item>
            <Form.Item label="Sách" name="books">
              <div>
                {editContract?.books?.map((v, i) => (
                  <span key={i}>
                    <p>
                      <span style={{ color: BOOK_STATUS[v.status].color }}>
                        {v.name}
                      </span>
                      <span>
                        {" "}
                        (Chậm:{" "}
                        {moneyFormat(violationCost[v._id]?.lateReturnFine)} -
                        Hỏng:{" "}
                        {moneyFormat(violationCost[v._id]?.damagedBookFine)})
                      </span>
                    </p>
                    <Select
                      defaultValue={editContract.returnBookStatus[v._id]}
                      options={Object.values(BOOK_STATUS).reduce((s, _v) => {
                        if (_v.value >= v.status) {
                          s.push({
                            label: _v.title,
                            value: _v.value,
                          });
                        }
                        return s;
                      }, [])}
                      onChange={(value) =>
                        onBookStatusChange({ bookId: v._id, value })
                      }
                    />
                  </span>
                ))}
              </div>
            </Form.Item>
            {contractStatus >= CONTRACT_STATUS.violation.value && (
              <>
                <Form.Item label="Phí phạt">
                  <span>
                    {`${violationCostTotal}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
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
