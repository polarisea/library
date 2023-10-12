export const ROLE_TYPES = {
  admin: {
    title: "Quản trị viên",
    value: 1,
  },
  user: {
    title: "Người dùng",
    value: 0,
  },
};

export const VOTING_VALUES = [-1, -0.5, 0, 0.5, 1];

for (const key in ROLE_TYPES) {
  Object.defineProperty(ROLE_TYPES, ROLE_TYPES[key].value, {
    value: ROLE_TYPES[key],
    enumerable: false,
  });
}

export const DEFAULT_COVER_URL = "https://localhost:3000/covers/default.jpg";
