import { CloudinaryObject, IUserInfo } from "./auth";
import { ICategory } from "./Account";

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: CloudinaryObject;
  category: ICategory;
  sold: number;
  price: number;
  discount: number;
  finalPrice: number;
  isPublished: boolean;
  isFree: boolean;
  reviewsNumber: number;
  instructor: IUserInfo;
  users: IUserInfo[];
  videosLength: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseData {
  title: string;
  description: string;
  price: number;
  thumbnail: CloudinaryObject;
  category: string;
  discount: number;
  isFree: boolean;
}

export interface ICourseResponse {
  courses: ICourse[];
  pagination: Pagination;
}
export interface IWishlistResponse {
  wishlist: ICourse[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pagesCount: number;
}
