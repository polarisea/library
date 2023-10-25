/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { App, Input, Button, Table, Modal, Popconfirm, Tag } from "antd";
import ContractForm from "./contractForm";
import AddButton from "../addButton";

import { vnDate } from "../../utils/date";

import {
  setLastAction,
  fetchTotal as fetchContractTotal,
  fetchContracts,
} from "../../slices/contract";

import {
  DEFAULT_COVER_URL,
  BOOK_STATUS,
  CONTRACT_STATUS,
} from "../../constants";

function ContractManagement() {
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const contractTotal = useSelector((state) => state.contract.total);
  const contracts = useSelector((state) => state.contract.contracts);
  const loading = useSelector((state) => state.contract.loading);
  const error = useSelector((state) => state.contract.error);
  const lastAction = useSelector((state) => state.contract.lastAction);

  const [editMode, setEditMode] = useState("add");
  const [selectedContract, setSelectedContract] = useState({});

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total: contractTotal,
    },
  });

  const [keyword, setKeyword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo(() => {
    return [
      {
        title: "Độc giả",
        dataIndex: "user",
        key: "user",
        render: (item) => item.name,
      },
      {
        title: "Sách",
        dataIndex: "books",
        key: "books",
        render: (item) => {
          return (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.map((v, i) => (
                <span
                  key={i}
                  className={`border-[1px] text-[12px] border-gray-200 block px-2 rounded   cursor-pointer `}
                  style={{
                    color: BOOK_STATUS[v.status].color,
                  }}
                >
                  {v.name}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: "Ngày mượn",
        dataIndex: "from",
        key: "from",
        render: (item) => {
          return vnDate(item);
        },
      },
      {
        title: "Ngày trả",
        dataIndex: "to",
        key: "to",
        render: (item) => {
          return vnDate(item);
        },
      },
      {
        title: "Ngày trả thực tế",
        dataIndex: "returnDate",
        key: "returnDate",
        render: (item) => {
          return item && vnDate(item);
        },
      },
      {
        title: "Tình trạng",
        dataIndex: "status",
        key: "status",
        render: (item) => (
          <span
            key={i}
            className={`border-[1px] text-[12px] border-gray-200 block px-2 rounded   cursor-pointer `}
            style={{
              color: CONTRACT_STATUS[item].color,
            }}
          >
            {CONTRACT_STATUS[item].title}
          </span>
        ),
      },
      {
        title: "",
        dataIndex: "_id",
        key: "_id",
        width: 175,
        fixed: "right",
        render: (item) => (
          <Button
            type="primary"
            onClick={() => {
              openEditMode(item);
            }}
          >
            Trả sách
          </Button>
        ),
      },
    ];
  }, [contracts]);

  const contractData = useMemo(() => {
    return contracts.map((v, _) => ({ key: v._id, ...v }));
  }, [contracts]);

  useEffect(() => {
    dispatch(fetchContractTotal());
    dispatch(fetchContracts());
  }, []);

  useEffect(() => {
    if (!loading) {
      if (lastAction == "deleteBook") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Xóa sách thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Xóa sách thành công",
            placement: "topRight",
          });
          dispatch(fetchContracts());
        }
        dispatch(setLastAction(null));
      }
      if (lastAction == "createBook") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Thêm sách thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Thêm sách thành công",
            placement: "topRight",
          });
          dispatch(fetchContracts());
          setModalOpen(false);
        }
        dispatch(setLastAction(null));
      }
      if (lastAction == "updateBook") {
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Cập nhật sách thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Cập nhật sách thành công",
            placement: "topRight",
          });
          dispatch(fetchContracts());
          setModalOpen(false);
        }
        dispatch(setLastAction(null));
      }
    }
  }, [loading]);

  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: contractTotal,
      },
    });
  }, [contractTotal]);

  function openEditMode(id) {
    for (const c of contracts) {
      if (c._id == id) {
        setSelectedContract(c);
        break;
      }
    }

    setEditMode("edit");
    setModalOpen(true);
  }

  function handleTableChange(pagination) {
    setTableParams({
      pagination,
    });
    dispatch(fetchContracts({ page: pagination.current - 1 }));
  }

  function onSearch() {
    dispatch(setSearch(keyword));
    dispatch(fetchContractTotal({ search: keyword }));
    dispatch(fetchContracts({ search: keyword }));
  }

  return (
    <>
      <Modal
        title={editMode == "add" ? "Mượn sách" : "Trả sách"}
        open={modalOpen}
        confirmLoading={loading}
        onCancel={() => {
          setModalOpen(false);
        }}
        footer={null}
        destroyOnClose={true}
      >
        <ContractForm
          closeModal={setModalOpen}
          mode={editMode}
          editContract={selectedContract}
        />
      </Modal>
      <div className="p-2  overflow-x-scroll max-lg:w-[100vw]">
        <div className="flex justify-between  mb-2 w-full ">
          <span className="w-[20rem]">
            <Input
              placeholder="Tìm kiếm..."
              value={keyword}
              size="large"
              onPressEnter={onSearch}
              onChange={(value) => setKeyword(value.target.value)}
            />
          </span>
          <AddButton
            onClick={() => {
              setSelectedContract({});
              setEditMode("add");
              setModalOpen(true);
            }}
          />
        </div>
        <Table
          bordered
          pagination={tableParams.pagination}
          columns={columns}
          dataSource={contractData}
          onChange={handleTableChange}
          loading={loading}
        />
      </div>
    </>
  );
}

export default ContractManagement;
