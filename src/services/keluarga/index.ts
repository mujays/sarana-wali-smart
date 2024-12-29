/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TKeluarga } from "./keluarga.type";

const KeluargaServices = {
  create: async (payload: any) => {
    const response = await axiosConfig.post<BaseResponsePaginate<TKeluarga>>(
      "/keluarga",
      payload
    );
    return response.data;
  },
  update: async (keluargaId: number, payload: any) => {
    const response = await axiosConfig.put<BaseResponsePaginate<TKeluarga>>(
      `/keluarga/${keluargaId}`,
      payload
    );
    return response.data;
  },
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TKeluarga>>(
      "/keluarga",
      {
        params,
      }
    );
    return response.data;
  },
  getOne: async (keluargaId: number) => {
    const response = await axiosConfig.get<BaseResponseDto<TKeluarga>>(
      `/keluarga/${keluargaId}`
    );
    return response.data;
  },
  delete: async (keluargaId: number) => {
    const response = await axiosConfig.delete<BaseResponseDto<TKeluarga>>(
      `/keluarga/${keluargaId}`
    );
    return response.data;
  },
};

export default KeluargaServices;
