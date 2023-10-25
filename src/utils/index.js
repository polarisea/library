export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const moneyFormat = (amount) => {
  return `${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
