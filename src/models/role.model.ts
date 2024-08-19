export interface ROLE_DETAIL {
  _id: string;
  name: string;
  description: string;
  endpointIds: string[];
  createAt: Date;
  createBy: string;
  updateAt: Date;
  updateBy: string;
}
export interface ROLE_DTO {
  name: string;
  description: string;
  endpointIds: string[];
}
