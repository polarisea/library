export const vnDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};
