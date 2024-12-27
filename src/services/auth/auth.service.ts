import axiosConfig from "@/configs/axios";
import { LoginResponseDto, UserType } from "./auth.dto";
import { ResponseBaseDto } from "@/types/response";

const AuthService = {
  me: async (params: { with?: string }) => {
    const response = await axiosConfig.get<ResponseBaseDto<UserType>>("/auth", {
      params,
    });
    return response.data;
  },
  login: async (payload: { email: string; password: string }) => {
    const response = await axiosConfig.post<ResponseBaseDto<LoginResponseDto>>(
      "/login",
      payload
    );
    return response.data;
  },
};

export default AuthService;
