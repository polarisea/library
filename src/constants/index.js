/* eslint-disable no-undef */

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
export const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI || "";

export const ROLES = {
  root: {
    title: "Root",
    value: 0,
    color: "red",
  },
  admin: {
    title: "Quản trị viên",
    value: 1,
    color: "yellow",
  },
  user: {
    title: "Độc giả",
    value: 100,
    color: "white",
  },
};

export const BOOK_STATUS = {
  new: {
    title: "Mới",
    value: 0,
    color: "green",
  },
  used: {
    title: "Đã sử dụng",
    value: 1,
    color: "blue",
  },
  broken: {
    title: "Hỏng",
    value: 2,
    color: "red",
  },
};

// requesting: {
//   title: "Đang yêu cầu",
//   value: 0,
// },
// acepted: {
//   title: "Chấp thuận",
//   value: 1,
// },

export const CONTRACT_STATUS = {
  pending: {
    title: "Đang hoạt động",
    value: 0,
    color: "green",
  },
  violation: {
    title: "Vi phạm",
    value: 1,
    color: "red",
  },
  finished: {
    title: "Hoàn thành",
    value: 2,
    color: "purple",
  },
};

export const VOTING_VALUES = [-1, -0.5, 0, 0.5, 1];

for (const key in ROLES) {
  Object.defineProperty(ROLES, ROLES[key].value, {
    value: ROLES[key],
    enumerable: false,
  });
}

for (const key in BOOK_STATUS) {
  Object.defineProperty(BOOK_STATUS, BOOK_STATUS[key].value, {
    value: BOOK_STATUS[key],
    enumerable: false,
  });
}

for (const key in CONTRACT_STATUS) {
  Object.defineProperty(CONTRACT_STATUS, CONTRACT_STATUS[key].value, {
    value: CONTRACT_STATUS[key],
    enumerable: false,
  });
}

export const DEFAULT_COVER_URL = "https://localhost:3000/covers/default.jpg";
export const PICTURE_HOST = "https://localhost:3000/pictures";
export const COVER_HOST = "https://192.168.1.44:3000/covers";
