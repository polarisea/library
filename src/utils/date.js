export const vnDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};

export const calculateDayDifference = (date1, date2) => {
  const d1 = new Date(date1.slice(0, 10)); // Thời gian 1
  const d2 = new Date(date2.slice(0, 10)); // Thời gian 2
  // Chuyển đổi thành số mili giây
  const timeDifference = d2 - d1;

  // Chuyển đổi thành số ngày
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return dayDifference;
};
