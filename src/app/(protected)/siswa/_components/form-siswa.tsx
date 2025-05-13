/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import Dropfile from "@/components/common/dropfile";
import FileItem from "@/components/common/file-item";
import errorResponse from "@/lib/error";
import { DatePicker, Form, Input, Select } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";

function FormSiswa() {
  //   const [loading, setLoading] = useState(false);
  const [fileAkte, setFileAkte] = useState<File | null>(null);
  const [fileKia, setFileKia] = useState<File | null>(null);
  const [fileKk, setFileKk] = useState<File | null>(null);
  const [ktpAyah, setKtpAyah] = useState<File | null>(null);
  const [ktpIbu, setKtpIbu] = useState<File | null>(null);

  const [form] = Form.useForm();

  const onSubmit = async (val: any) => {
    try {
      //   setLoading(true);
      console.log(val);
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      //   setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Siswa",
              url: "/siswa",
            },
            {
              title: "Edit Siswa",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Data Siswa</p>
      </div>

      <div>
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="p-5 rounded-lg border border-gray-300 mb-5">
            <p className="text-center font-semibold text-xl mb-5">Data Siswa</p>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item label="NIS" name="nis" className="w-full !mb-2">
                <Input
                  placeholder="NIS"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ nis: value });
                  }}
                />
              </Form.Item>
              <Form.Item label="NISN" name="nisn" className="w-full !mb-2">
                <Input
                  placeholder="NISN"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ nisn: value });
                  }}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                label="NIK"
                name="nik"
                className="w-full !mb-2"
                rules={[{ required: true, message: "NIK harus diisi" }]}
              >
                <Input
                  placeholder="NIK"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ nik: value });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Nama"
                name="nama"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Nama harus diisi" }]}
              >
                <Input placeholder="Nama" maxLength={255} />
              </Form.Item>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                className="w-full !mb-2"
                label="Bahasa Sehari-hari"
                name="bahasa_sehari"
                rules={[{ required: true, message: "bahasa harus diisi" }]}
              >
                <Select
                  placeholder="Pilih Bahasa"
                  options={[
                    {
                      label: "Bahasa Indonesia",
                      value: "Bahasa Indonesia",
                    },
                    {
                      label: "Bahasa Inggris",
                      value: "Bahasa Inggris",
                    },
                    {
                      label: "Bahasa Arab",
                      value: "Bahasa Arab",
                    },
                    {
                      label: "Lainnya",
                      value: "Lainnya",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Kewarganegaraan"
                name="kewarganegaraan"
                className="w-full !mb-2"
                rules={[
                  { required: true, message: "Kewarganegaraan harus diisi" },
                ]}
              >
                <Input placeholder="kewarganegaraan" maxLength={255} />
              </Form.Item>
            </div>
            <Form.Item
              label="Alamat"
              name="alamat"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Alamat harus diisi" }]}
            >
              <Input.TextArea placeholder="Tulis alamat..." maxLength={255} />
            </Form.Item>

            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                label="Tempat Lahir"
                name="tempat_lahir"
                className="w-full !mb-2"
              >
                <Input placeholder="Tempat Lahir" maxLength={255} />
              </Form.Item>
              <Form.Item
                name="tanggal_lahir"
                label="Tanggal Lahir"
                className="w-full mb-2"
                rules={[
                  { required: true, message: "tanggal lahir harus diisi" },
                ]}
              >
                <DatePicker
                  allowClear={false}
                  format="DD/MM/YYYY"
                  className="w-full"
                />
              </Form.Item>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                label="Agama"
                name="agama"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Agama harus diisi" }]}
              >
                <Input placeholder="Agama" maxLength={255} />
              </Form.Item>
              <Form.Item
                className="w-full !mb-2"
                label="Jenis Kelamin"
                name="jenis_kelamin"
                rules={[
                  { required: true, message: "Jenis Kelamin harus diisi" },
                ]}
              >
                <Select
                  placeholder="Pilih Jenis Kelamin"
                  options={[
                    {
                      label: "Laki-laki",
                      value: "Laki-laki",
                    },
                    {
                      label: "Perempuan",
                      value: "Perempuan",
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                label="Telepon"
                name="telp_rumah"
                className="w-full !mb-2"
              >
                <Input
                  placeholder="Telepon"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ telp_rumah: value });
                  }}
                />
              </Form.Item>
              <Form.Item label="Suku" name="suku" className="w-full !mb-2">
                <Input placeholder="Suku" maxLength={255} />
              </Form.Item>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                label="Tinggi Badan"
                name="tinggi_badan"
                className="w-full !mb-2"
              >
                <Input
                  placeholder="Tinggi Badan"
                  maxLength={255}
                  suffix="CM"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ tinggi_badan: value });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Berat Badan"
                name="berat_badan"
                className="w-full !mb-2"
              >
                <Input
                  placeholder="Berat Badan"
                  maxLength={255}
                  suffix="Kg"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ berat_badan: value });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Lingkar Kepala"
                name="lingkar_kepala"
                className="w-full !mb-2"
              >
                <Input
                  placeholder="Lingkar Kepala"
                  maxLength={255}
                  suffix="CM"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ lingkar_kepala: value });
                  }}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                className="w-full !mb-2"
                label="Golongan Darah"
                name="gol_darah"
              >
                <Select
                  placeholder="Pilih Golongan Darah"
                  options={[
                    {
                      label: "A",
                      value: "A",
                    },
                    {
                      label: "B",
                      value: "B",
                    },
                    {
                      label: "AB",
                      value: "AB",
                    },
                    {
                      label: "O",
                      value: "O",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                className="w-full !mb-2"
                label="Tinggal Bersama"
                name="tinggal_bersama"
              >
                <Select
                  placeholder="Pilih Tinggal Bersama"
                  options={[
                    {
                      label: "Orang Tua",
                      value: "Orang Tua",
                    },
                    {
                      label: "Anggota Keluarga Lain",
                      value: "Anggota Keluarga Lain",
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Form.Item
                label="Anak Ke"
                name="anak_ke"
                className="w-full !mb-2"
              >
                <Input
                  placeholder="Anak Ke"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ anak_ke: value });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Dari Berapa Saudara"
                name="jumlah_saudara"
                className="w-full !mb-2"
              >
                <Input
                  placeholder="Dari Berapa Saudara"
                  maxLength={255}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ jumlah_saudara: value });
                  }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-gray-300 space-y-3">
            <p className="text-center font-semibold text-xl mb-2">Dokumen</p>

            <div className="space-y-2 border-t border-gray-300 pt-3">
              <p className="font-medium text-sm">Akte Kelahiran</p>
              {!fileAkte ? (
                <Dropfile
                  id="akte"
                  description="PNG, JPG dan PDF"
                  type="transparent"
                  onUpload={(file) => {
                    setFileAkte(file);
                  }}
                />
              ) : (
                <FileItem
                  url={URL.createObjectURL(fileAkte)}
                  onSuccess={(url) => {
                    form.setFieldValue("url_akta", url);
                  }}
                  file={fileAkte}
                  onDelete={() => {
                    setFileAkte(null);
                    form.setFieldValue("url_akta", "");
                  }}
                />
              )}
            </div>

            <div className="space-y-2 border-t border-gray-300 pt-3">
              <p className="font-medium text-sm">Kartu Identitas Anak (KIA)</p>
              {!fileKia ? (
                <Dropfile
                  id="kia"
                  description="PNG, JPG dan PDF"
                  type="transparent"
                  onUpload={(file) => {
                    setFileKia(file);
                  }}
                />
              ) : (
                <FileItem
                  url={URL.createObjectURL(fileKia)}
                  onSuccess={(url) => {
                    form.setFieldValue("url_kia", url);
                  }}
                  file={fileKia}
                  onDelete={() => {
                    setFileKia(null);
                    form.setFieldValue("url_kia", "");
                  }}
                />
              )}
            </div>

            <div className="space-y-2 border-t border-gray-300 pt-3">
              <p className="font-medium text-sm">Kartu Keluarga (KK)</p>
              {!fileKk ? (
                <Dropfile
                  id="kk"
                  description="PNG, JPG dan PDF"
                  type="transparent"
                  onUpload={(file) => {
                    setFileKk(file);
                  }}
                />
              ) : (
                <FileItem
                  url={URL.createObjectURL(fileKk)}
                  onSuccess={(url) => {
                    form.setFieldValue("url_kk", url);
                  }}
                  file={fileKk}
                  onDelete={() => {
                    setFileKk(null);
                    form.setFieldValue("url_kk", "");
                  }}
                />
              )}
            </div>

            <div className="space-y-2 border-t border-gray-300 pt-3">
              <p className="font-medium text-sm">KTP Ayah</p>
              {!ktpAyah ? (
                <Dropfile
                  id="ktp_ayah"
                  description="PNG, JPG dan PDF"
                  type="transparent"
                  onUpload={(file) => {
                    setKtpAyah(file);
                  }}
                />
              ) : (
                <FileItem
                  url={URL.createObjectURL(ktpAyah)}
                  onSuccess={(url) => {
                    form.setFieldValue("ktp_ayah", url);
                  }}
                  file={ktpAyah}
                  onDelete={() => {
                    setKtpAyah(null);
                    form.setFieldValue("ktp_ayah", "");
                  }}
                />
              )}
            </div>

            <div className="space-y-2 border-t border-gray-300 pt-3">
              <p className="font-medium text-sm">KTP Ibu</p>
              {!ktpIbu ? (
                <Dropfile
                  id="ktp_ibu"
                  description="PNG, JPG dan PDF"
                  type="transparent"
                  onUpload={(file) => {
                    setKtpIbu(file);
                  }}
                />
              ) : (
                <FileItem
                  url={URL.createObjectURL(ktpIbu)}
                  onSuccess={(url) => {
                    form.setFieldValue("ktp_ibu", url);
                  }}
                  file={ktpIbu}
                  onDelete={() => {
                    setKtpIbu(null);
                    form.setFieldValue("ktp_ibu", "");
                  }}
                />
              )}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default FormSiswa;
