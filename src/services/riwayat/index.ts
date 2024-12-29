/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TRiwayat } from "./riwayat.type";

const RiwayatServices = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TRiwayat>>(
      "/riwayat",
      payload
    );
    return response.data;
  },
  update: async (riwayatId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TRiwayat>>(
      `/riwayat/${riwayatId}`,
      payload
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TRiwayat>>(
      "/riwayat",
      {
        params,
      }
    );
    return response.data;
  },
  getOne: async (riwayatId: number) => {
    const response = await axiosConfig.get<BaseResponseDto<TRiwayat>>(
      `/riwayat/${riwayatId}`
    );
    return response.data;
  },
  delete: async (riwayatId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TRiwayat>>(
      `/riwayat/${riwayatId}`
    );
    return response.data;
  },
};

export default RiwayatServices;
