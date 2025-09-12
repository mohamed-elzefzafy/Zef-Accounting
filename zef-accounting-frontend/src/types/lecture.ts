import { ICourse } from "./course";

export interface ILecture {
  _id: string;
  title: string;
  videoUrl: CloudinaryObjectVideo;
  position: number;
  isFree: boolean;
  course: ICourse;
  attachments: CloudinaryObjectPdf[];
  createdAt: string;
  updatedAt: string;
}

export interface ILectureData {
  title: string;
  videoUrl: CloudinaryObjectVideo;
  position?: number;
  course: string;
}

export interface ILectureResponse {
  lectures: ILecture[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pagesCount: number;
}

export type CloudinaryObjectPdf = {
  url: string;
  public_id: string | null;
  originalName: string;
};

export type CloudinaryObjectVideo = {
  url: string;
  public_id: string | null;
  videoDuration: string;
  originalDuration: number;
};
