export interface USER_DTO {
  name: string;
  password: string;
  phoneNumber: string;
  mail: string;
  role: string;
}
export interface USER_DETAIL {
  _id: string;
  name: string;
  password: string;
  phoneNumber: string;
  mail: string;
  role: string;
  createAt: Date;
  updateAt: Date;
}
export interface USER_LOGIN_DTO {
  mail: string;
  password: string;
}
export interface USER_SHOW {
  name: string;
  phoneNumber: string;
  mail: string;
  role: string;
}