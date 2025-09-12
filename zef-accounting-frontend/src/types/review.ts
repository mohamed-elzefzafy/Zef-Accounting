import { IUserInfo } from "./auth";
import { ICourse, Pagination } from "./course";

export interface IReview {
  _id: string;
  comment: string;
  rating: number;
  user: IUserInfo; 
  course: ICourse;
  createdAt: string;
  updatedAt: string;
}


export interface IReviewResponse {
  reviews: IReview[];
  pagination: Pagination;
}