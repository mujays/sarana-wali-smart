/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TSiswa } from "./siswa.type";

const SiswaServices = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TSiswa>>(
      "/siswa",
      payload
    );
    return response.data;
  },
  update: async (siswaId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TSiswa>>(
      `/siswa/${siswaId}`,
      payload
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TSiswa>>(
      "/siswa",
      {
        params,
      }
    );
    return response.data;
  },
  getOne: async (siswaId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TSiswa>>(
      `/siswa/${siswaId}`,
      { params }
    );
    return response.data;
  },
  import: async (formData: FormData) => {
    const response = await axiosConfig.postForm<BaseResponseDto<TSiswa>>(
      `/siswa/import`,
      formData
    );
    return response.data;
  },
  delete: async (siswaId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TSiswa>>(
      `/siswa/${siswaId}`
    );
    return response.data;
  },
};

export default SiswaServices;
