export type ResponseBaseDto<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};
