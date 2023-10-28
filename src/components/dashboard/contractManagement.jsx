/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  App,
  Select,
  Input,
  Button,
  Table,
  Modal,
  Popconfirm,
  Tag,
} from "antd";
import ContractForm from "./contractForm";
import AddButton from "../addButton";

import { vnDate } from "../../utils/date";
import { moneyFormat } from "../../utils";
import {
  setLastAction,
  fetchTotal as fetchContractTotal,
  updateContract,
  fetchContracts,
} from "../../slices/contract";

import { DEFAULT_COVER_URL, BOOK_STATUS, CONTRACTS } from "../../constants";

const statusOptions = Object.values(CONTRACTS).map((item) => ({
  label: item.title,
  value: item.value,
}));

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
      simple: true,
    },
  });

  const [keyword, setKeyword] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState();

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
        dataIndex: "book",
        key: "book",
        render: (item) => item?.name || "Đã bị xóa",
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
            style={{
              color: CONTRACTS[item].color,
            }}
          >
            {CONTRACTS[item].title}
          </span>
        ),
      },
      {
        title: "Phí phạt",
        dataIndex: "violationCost",
        key: "violationCost",
        render: (item) => moneyFormat(item),
      },
      {
        title: "",
        dataIndex: "_id",
        key: "_id",
        width: 175,
        fixed: "right",
        render: (item) => {
          let isRequesting = false;
          for (const c of contracts) {
            if (c._id == item) {
              if (c.status == CONTRACTS.requesting.value) {
                isRequesting = true;
                break;
              }
            }
          }
          return (
            <Button
              type="primary"
              onClick={() => {
                if (isRequesting) {
                  dispatch(
                    updateContract({
                      id: item,
                      body: { status: CONTRACTS.pending.value },
                    })
                  );
                } else {
                  openEditMode(item);
                }
              }}
            >
              {isRequesting ? "Chấp thuận" : "Trả sách"}
            </Button>
          );
        },
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
      if (lastAction == "updateContract") {
        dispatch(setLastAction(null));
        if (error) {
          notification.error({
            message: "Thông báo",
            description: "Cập nhật hợp đồng thất bại",
            placement: "topRight",
          });
        } else {
          notification.success({
            message: "Thông báo",
            description: "Cập nhật hợp đồng thành công",
            placement: "topRight",
          });
          dispatch(fetchContracts());
          setModalOpen(false);
        }
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
    dispatch(
      fetchContracts({ page: pagination.current - 1, search: keyword, status })
    );
  }

  function onFilter(overwrite) {
    dispatch(fetchContractTotal({ search: keyword, status, ...overwrite }));
    dispatch(fetchContracts({ search: keyword, status, ...overwrite }));
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
        <div className="flex  justify-between   mb-2 w-full flex-wrap gap-1">
          <span className="flex justify-start gap-2 max-lg:w-full  flex-wrap">
            <span className="w-[20rem] max-lg:w-[95%]">
              <Input
                placeholder="Tìm kiếm..."
                value={keyword}
                size="large"
                onPressEnter={(e) => onFilter({ search: e.target.value })}
                onChange={(value) => setKeyword(value.target.value)}
              />
            </span>
            <Select
              size="large"
              value={status}
              options={statusOptions}
              allowClear
              className="w-[20rem] max-lg:w-[95%]"
              placeholder="Tình trạng"
              onChange={(value) => {
                setStatus(value);
                onFilter({ status: value });
              }}
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
