import { TSiswa } from "../siswa/siswa.type";

export type TAdmission = {
  tagihan: string;
  id: number;
  siswa_id: number;
  tahun_ajaran_id: number;
  nama: string;
  nominal: number;
  cicilan: number;
  pembayaran_sudah: number;
  keterangan: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  siswa: TSiswa;
  created_at: string;
  updated_at: string;
};

export type TTransactionAdmission = {
  id: number;
  uang_pangkal_id: number;
  payment_method: string;
  cicilan: number;
  payment_amount: number;
  status: string;
  net_payment: number;
  transaction_fee: number;
  buyer_payment: number;
  transaction_sid: string;
  transaction_id_ipaymu: string;
  payment_at: string;
  bukti_pembayaran: string;
  uang_pangkal: TAdmission;
  created_at: string;
  updated_at: string;
};
