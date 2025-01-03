/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { BaseResponseDto, BaseResponsePaginate } from "@/types/response";
import { TTagihan, TTransaction } from "./tagihan.type";

const TagihanService = {
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TTagihan>>(
      "/tagihan",
      {
        params,
      }
    );
    return response.data;
  },
  getTrx: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TTransaction>>(
      "/transaction",
      {
        params,
      }
    );
    return response.data;
  },
  getTahunAjaran: async (params?: any) => {
    const response = await axiosConfig.get("/tahun-ajaran", {
      params,
    });
    return response.data;
  },
  getOne: async (typeId: number, params?: any) => {
    const response = await axiosConfig.get<BaseResponseDto<TTagihan>>(
      `/tagihan/${typeId}`,
      { params }
    );
    return response.data;
  },
  payment: async (tagihanId: number, payload?: any) => {
    const response = await axiosConfig.get(`/payment/${tagihanId}`, {
      params: payload,
    });
    return response.data;
  },
};

export default TagihanService;
