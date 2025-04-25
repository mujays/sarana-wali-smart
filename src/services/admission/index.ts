/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { BaseResponsePaginate } from "@/types/response";
import { TAdmission, TTransactionAdmission } from "./tagihan.type";

const AdmissionService = {
  get: async (params?: any) => {
    const response = await axiosConfig.get<BaseResponsePaginate<TAdmission>>(
      "/uang-pangkal",
      {
        params,
      }
    );
    return response.data;
  },
  getTrx: async (params?: any) => {
    const response = await axiosConfig.get<
      BaseResponsePaginate<TTransactionAdmission>
    >("/uang-pangkal-transaksi", {
      params,
    });
    return response.data;
  },
  payment: async (tagihanId: number, payload?: any) => {
    const response = await axiosConfig.get(`/uang-pangkal/${tagihanId}/pay`, {
      params: payload,
    });
    return response.data;
  },
};

export default AdmissionService;
