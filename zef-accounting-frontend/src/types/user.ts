import { IUserInfo } from "./auth";
import { Pagination } from "./course";



export interface IUserResponse {
  users: IUserInfo[] ;
  pagination: Pagination;
}