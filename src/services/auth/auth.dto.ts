export type UserType = {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  avatar?: string;
  deleted_at: null | Date;
  created_at: null | Date;
  updated_at: null | Date;
};

export type ForgotPasswordTokenType = {
  id: number;
  email: string;
  reset_password_token: string;
  reset_password_token_expired_at: string;
  nama: string;
  hubungan: string;
  no_hp: string;
  pekerjaan: string;
  gaji: number;
  created_at: null | Date;
  updated_at: null | Date;
};

export type LoginResponseDto = {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: null;
    deleted_at: null | Date;
    created_at: null | Date;
    updated_at: null | Date;
  };
  token: string;
};
