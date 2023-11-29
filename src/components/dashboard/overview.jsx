/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TeamOutlined,
  BookOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

import {
  Chart as ChartJS,
  Title,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

import Card from "./card";
import {
  setSearch as setUserSearch,
  fetchTotal as fetchUserTotal,
} from "../../slices/user";
import { fetchTotal as fetchContractTotal } from "../../slices/contract";
import {
  setSearch as setBookSearch,
  fetchTotal as fecthBookTotal,
} from "../../slices/book";

import {
  fetchBookStatusCount,
  fetchBorrowedBookCount,
  fetchBookInCategoryCount,
  fetchContractStatusCount,
  fetchContractCountInLast12Months,
} from "../../slices/chart";

import { BOOK_STATUS, CONTRACTS } from "../../constants";

function Overview() {
  const dispatch = useDispatch();
  const userTotal = useSelector((state) => state.user.total);
  const contractTotal = useSelector((state) => state.contract.total);
  const bookStatusCount = useSelector((state) => state.chart.bookStatusCount);

  const borrowedBookCount = useSelector(
    (state) => state.chart.borrowedBookCount
  );
  const bookInCategoryCount = useSelector(
    (state) => state.chart.bookInCategoryCount
  );

  const contractStatusCount = useSelector(
    (state) => state.chart.contractStatusCount
  );

  const contractCountInLast12months = useSelector(
    (state) => state.chart.contractCountInLast12months
  );

  useEffect(() => {
    dispatch(setUserSearch(null));
    dispatch(setBookSearch(null));
    dispatch(fetchUserTotal({ search: null }));
    dispatch(fetchContractTotal());
    dispatch(fecthBookTotal({ search: null }));
    dispatch(fetchBookStatusCount());
    // dispatch(fetchBorrowedBookCount());
    dispatch(fetchBookInCategoryCount());
    dispatch(fetchContractStatusCount());
    dispatch(fetchContractCountInLast12Months());
  }, []);

  const bookTotal = useMemo(() => {
    if (bookStatusCount) {
      return (
        bookStatusCount.totalStockCount + bookStatusCount.totalBorrowedCount
      );
    }
  }, [bookStatusCount]);

  const bookStatus = useMemo(() => {
    const data = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 1,
        },
      ],
    };
    if (bookStatusCount) {
      data.labels = ["Sách trong kho", "Sách đang được mượn", "Sách bị hỏng"];
      data.datasets[0].data = [
        bookStatusCount.totalStockCount,
        bookStatusCount.totalBorrowedCount,
        bookStatusCount.totalBrokenCount,
      ];
      data.datasets[0].backgroundColor = ["green", "yellow", "red"];
    }
    return data;
  }, [bookStatusCount]);

  const bookInCategory = useMemo(() => {
    const data = {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          backgroundColor: "aqua",
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    };
    if (!bookInCategoryCount) return data;

    const tmp = Object.values(bookInCategoryCount).reduce((o, v) => {
      o[v._id] = v.count;
      return o;
    }, {});
    for (const k in tmp) {
      data.labels.push(k);
      const amount = tmp[k];

      data.datasets[0].data.push(amount);
    }
    return data;
  }, [bookInCategoryCount]);

  const contractStatus = useMemo(() => {
    const data = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 1,
        },
      ],
    };
    if (!contractStatusCount) return data;
    const tmp = contractStatusCount.reduce((result, obj) => {
      result[obj._id] = obj.count;
      return result;
    }, {});

    for (const k in CONTRACTS) {
      data.labels.push(CONTRACTS[k].title);
      const amount = tmp[CONTRACTS[k].value];

      data.datasets[0].data.push(amount);
      data.datasets[0].backgroundColor.push(CONTRACTS[k].color);
    }
    return data;
  }, [contractStatusCount]);

  const contractInLast12 = useMemo(() => {
    const data = {
      labels: [],
      fill: true,
      datasets: [
        {
          label: "",
          fill: true,
          data: [],
          backgroundColor: "rgba(0, 181, 204, 0.5)",
          borderColor: "blue",
          borderWidth: 1,
          tension: 0.5,
        },
      ],
    };

    if (!contractCountInLast12months) return data;
    for (const m of contractCountInLast12months) {
      data.labels.push(m._id.month);
      data.datasets[0].data.push(m.count);
    }
    return data;
  }, [contractCountInLast12months]);

  return (
    <div className="flex flex-wrap  gap-2 max-lg:w-[95vw]  justify-center h-[calc(100vh-45.5px)] overflow-y-scroll">
      <div className="lg:w-3/5 w-full flex justify-center bg-gray-50 rounded-lg shadow-lg py-5 items-center">
        <Line
          style={{
            width: "90%",
          }}
          data={contractInLast12}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                position: "bottom",
                display: true,
                text: "Lượng mượn sách 12 tháng gần nhất",
              },
            },
            interaction: {
              mode: "index",
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Tháng",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Lượt mượn",
                },
              },
            },
          }}
        />
      </div>
      <div className="flex lg:gap-8 gap-4 max-lg:mt-5 flex-col lg:w-[30%] w-full justify-center items-center">
        <Card title="Người dùng" value={userTotal} icon={<TeamOutlined />} />
        <Card title="Sách" value={bookTotal} icon={<BookOutlined />} />
        <Card
          title="Lượt thuê"
          value={contractTotal}
          icon={<SolutionOutlined />}
        />
      </div>

      <div className="flex flex-col  mt-5 lg:w-[25%] w-full gap-3">
        <div className="bg-gray-50 rounded-lg shadow-lg flex justify-center">
          <Doughnut
            data={bookStatus}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  position: "bottom",
                  display: true,
                  text: "Tình trạng sách",
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-50 rounded-lg shadow-lg flex justify-center">
          <Doughnut
            data={contractStatus}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  position: "bottom",
                  display: true,
                  text: "Thuê sách",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap flex-col justify-center mt-5 lg:w-[70%] p-5 bg-gray-50 rounded-lg shadow-lg h-fit">
        <Bar
          style={{ width: "100%" }}
          data={bookInCategory}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                position: "bottom",
                display: true,
                text: "Số lượng sách trong các thể loại",
              },
            },
            interaction: {
              mode: "index",
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Thể loại",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Số lượng sách",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Overview;
