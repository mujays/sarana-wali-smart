import axiosConfig from "@/configs/axios";
import { BaseResponseDto } from "@/types/response";
import { ForgotPasswordTokenType, LoginResponseDto } from "./auth.dto";

const AuthService = {
  me: async (params: { with?: string }) => {
    const response = await axiosConfig.get<
      BaseResponseDto<ForgotPasswordTokenType>
    >("/wali", {
      params,
    });
    return response.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const response = await axiosConfig.post<BaseResponseDto<LoginResponseDto>>(
      "/login",
      payload
    );
    return response.data;
  },
  forgotPasswordSend: async (payload: { email: string }) => {
    const response = await axiosConfig.get<
      BaseResponseDto<ForgotPasswordTokenType>
    >("/reset-password", {
      params: payload,
    });
    return response.data;
  },
  getUserforgotPassword: async (token: string) => {
    const response = await axiosConfig.get<
      BaseResponseDto<ForgotPasswordTokenType>
    >(`/reset-password/${token}`);
    return response.data;
  },
  confirmforgotPassword: async (payload: { email: string; token: string }) => {
    const response = await axiosConfig.post<
      BaseResponseDto<ForgotPasswordTokenType>
    >(`/reset-password`, payload);
    return response.data;
  },
};

export default AuthService;
