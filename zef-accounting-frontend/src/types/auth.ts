import { ICourse } from "./course";

export interface UserRegister {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  }

  export interface IUserUpdate {
    firstName?: string,
    lastName?: string,
    password?: string,
  }
  export interface IUserUpdate2 {
    firstName: string,
    lastName: string,
    password: string,
  }
export interface UserLogin {
    email: string,
    password: string,
  }


  export interface IUserInfo {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: CloudinaryObject;
    isAccountVerified: boolean;
    verificationCode: number | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    wishlist : ICourse[]
  }

  export type CloudinaryObject = {
    url: string;
    public_id: string | null;
  };




