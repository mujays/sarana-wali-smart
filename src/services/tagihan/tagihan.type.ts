export type TTagihan = {
  id: number;
  siswa_id: number;
  tagihan: string;
  jatuh_tempo: number;
  tahun_ajaran_id: 1;
  bulan: string;
  biaya: number;
  is_lunas: boolean;
  created_at: string;
  updated_at: string;
};

export type RequestBodyTagihanDto = {
  bulan: number;
  tahun_ajaran: number;
  siswa_id: number;
  biaya: string;
};

export type TTransaction = {
  id: number;
  wali_id: number;
  tagihan_id: number;
  transaction_sid: string;
  transaction_id_ipaymu: string | null;
  status: string;
  buyer_payment: number;
  net_payment: number;
  transaction_fee: number;
  payment_at: string | null;
  payment_method: null | string;
  bukti_pembayaran: null | string;
  created_at: string;
  updated_at: string;
};
