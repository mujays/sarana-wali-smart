import { TKelas } from "../kelas/kelas.type";
import { TKeluarga } from "../keluarga/keluarga.type";

export type TSiswa = {
  id: number;
  nisn: string;
  nis: string;
  nik: string;
  nama: string;
  agama: string;
  tanggal_lahir: string;
  gol_darah?: null | string;
  type?: null | string;
  alamat: string;
  no_telp?: null | string;
  bahasa_sehari: string;
  ibu_kandung: string;
  kewarganegaraan: string;
  tanggal_masuk: string;
  lulusan_dari: string;
  alamat_sekolah_asal: string;
  tanggal_keluar?: null | string;
  kelas?: TKelas[];
  keluarga?: TKeluarga[];
  created_at: string;
  updated_at: string;
};
