/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Children,
  useState,
  useEffect,
  isValidElement,
  cloneElement,
} from "react";
import { Input, Button, ConfigProvider, Table, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

function Management({
  columns,
  total,
  data,
  loading,
  fetchTotalAction,
  fetchDataAction,
  setSearchAction,
  addForm,
}) {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      total,
    },
  });

  useEffect(() => {
    dispatch(fetchDataAction());
    dispatch(fetchTotalAction());
  }, []);

  //  kw
  useEffect(() => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total,
      },
    });
  }, [total]);

  const AddForm = Children.map(addForm, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { closeModal: handleCancel });
    }
    return child;
  });

  function showModal() {
    setOpen(true);
  }
  function handleCancel() {
    setOpen(false);
  }

  function handleTableChange(pagination) {
    setTableParams({
      pagination,
    });
    dispatch(fetchDataAction({ page: pagination.current - 1 }));
  }

  function onSearch() {
    dispatch(setSearchAction(keyword));
    dispatch(fetchTotalAction({ search: keyword }));
    dispatch(fetchDataAction({ search: keyword }));
  }

  return (
    <>
      <Modal
        title="Thêm mới"
        open={open}
        confirmLoading={loading}
        onCancel={handleCancel}
        okText="Thêm"
        okType="primary"
        footer={null}
      >
        {AddForm}
      </Modal>
      <div className="p-5 ">
        <div className="flex justify-between px-5 mb-2 w-full">
          <span className="w-[20rem]">
            <Input
              placeholder="Tìm kiếm..."
              value={keyword}
              size="large"
              onPressEnter={onSearch}
              onChange={(value) => setKeyword(value.target.value)}
            />
          </span>
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
              size="large"
              shape="circle"
              icon={<PlusOutlined />}
              styles={{ backgroundColor: "green" }}
              onClick={showModal}
            ></Button>
          </ConfigProvider>
        </div>
        <Table
          bordered
          pagination={tableParams.pagination}
          columns={columns}
          dataSource={data}
          onChange={handleTableChange}
          loading={loading}
        />
      </div>
    </>
  );
}

export default Management;
