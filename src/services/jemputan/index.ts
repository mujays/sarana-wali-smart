/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TJemputan } from "./jemputan.type";

const JemputanServices = {
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TJemputan>>(
      "/pickup",
      {
        params,
      }
    );
    return response.data;
  },
  getOne: async (pickupId: number) => {
    const response = await axiosConfig.get<BaseResponseDto<TJemputan>>(
      `/pickup/${pickupId}`
    );
    return response.data;
  },
  generate: async (siswaId: number) => {
    const response = await axiosConfig.get<BaseResponseDto<TJemputan>>(
      `siswa/${siswaId}/pickup`
    );
    return response.data;
  },
};

export default JemputanServices;
