/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import Dropfile from "@/components/common/dropfile";
import FileItem from "@/components/common/file-item";
import errorResponse from "@/lib/error";
import SiswaServices from "@/services/siswa";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Select, Skeleton } from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEmojiValidation } from "@/hooks/use-emoji-validation";

function FormSiswa() {
  const [loading, setLoading] = useState(false);
  const [fileAkte, setFileAkte] = useState<File | string | null>(null);
  const [fileKia, setFileKia] = useState<File | string | null>(null);
  const [fileKk, setFileKk] = useState<File | string | null>(null);
  const [avatar, setAvatar] = useState<File | string | null>(null);

  const [urlAkte, setUrlAkte] = useState<string>("");
  const [urlKia, setUrlKia] = useState<string>("");
  const [urlKk, setUrlKk] = useState<string>("");
  const [urlavatar, setUrlavatar] = useState<string>("");

  const [form] = Form.useForm();

  // Hook untuk emoji validation
  const { handleInputChange, handleTextAreaChange, handlePaste } =
    useEmojiValidation({
      showToast: true,
      autoClean: true,
    });

  const { id } = useParams();
  const { data: siswa, isLoading } = useQuery({
    queryKey: ["SISWA", id],
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(id as string), {
        with: "keluarga",
      });
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      const payload = {
        ...val,
        tanggal_lahir: dayjs(val?.tanggal_lahir).format("YYYY-MM-DD"),
        avatar: urlavatar || avatar,
        url_kk: urlKk || fileKk,
        url_kia: urlKia || fileKia,
        url_akta: urlAkte || fileAkte,
      };
      await SiswaServices.update(+id, payload);
      toast.success("Data berhasil diperbarui!");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (siswa) {
      form.setFieldValue("nik", siswa.data.nik);
      form.setFieldValue("nama", siswa.data.nama);
      form.setFieldValue("bahasa_sehari", siswa.data.bahasa_sehari);
      form.setFieldValue("kewarganegaraan", siswa.data.kewarganegaraan);
      form.setFieldValue("agama", siswa.data.agama);
      form.setFieldValue("tanggal_lahir", dayjs(siswa.data.tanggal_lahir));
      form.setFieldValue("tempat_lahir", siswa.data.tempat_lahir);
      form.setFieldValue("alamat", siswa.data.alamat);
      form.setFieldValue("jenis_kelamin", siswa.data.jenis_kelamin);
      form.setFieldValue("suku", siswa.data.suku);
      form.setFieldValue("telp_rumah", siswa.data.telp_rumah);
      form.setFieldValue("tinggi_badan", siswa.data.tinggi_badan);
      form.setFieldValue("berat_badan", siswa.data.berat_badan);
      form.setFieldValue("lingkar_kepala", siswa.data.lingkar_kepala);
      form.setFieldValue("tinggal_bersama", siswa.data.tinggal_bersama);
      form.setFieldValue("jumlah_saudara", siswa.data.jumlah_saudara);
      form.setFieldValue("gol_darah", siswa.data.gol_darah);
      form.setFieldValue("anak_ke", siswa.data.anak_ke);
      setAvatar(siswa.data.avatar);
      setFileAkte(siswa.data.url_akta);
      setFileKia(siswa.data.url_kia);
      setFileKk(siswa.data.url_kk);
    }
  }, [siswa]);

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

      {isLoading ? (
        <Skeleton />
      ) : (
        <div>
          <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
            <div className="p-5 rounded-lg border border-gray-300 mb-5">
              <p className="text-center font-semibold text-xl mb-5">
                Data Siswa
              </p>
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
                    onChange={handleInputChange((e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ nik: value });
                    })}
                    onPaste={handlePaste}
                  />
                </Form.Item>
                <Form.Item
                  label="Nama"
                  name="nama"
                  className="w-full !mb-2"
                  rules={[{ required: true, message: "Nama harus diisi" }]}
                >
                  <Input
                    placeholder="Nama"
                    maxLength={255}
                    onChange={handleInputChange((e) => {
                      form.setFieldsValue({ nama: e.target.value });
                    })}
                    onPaste={handlePaste}
                  />
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
                  <Input
                    placeholder="kewarganegaraan"
                    maxLength={255}
                    onChange={handleInputChange((e) => {
                      form.setFieldsValue({ kewarganegaraan: e.target.value });
                    })}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </div>
              <Form.Item
                label="Alamat"
                name="alamat"
                className="w-full !mb-2"
                rules={[{ required: true, message: "Alamat harus diisi" }]}
              >
                <Input.TextArea
                  placeholder="Tulis alamat..."
                  maxLength={255}
                  onChange={handleTextAreaChange((e) => {
                    form.setFieldsValue({ alamat: e.target.value });
                  })}
                  onPaste={handlePaste}
                />
              </Form.Item>

              <div className="flex flex-col md:flex-row gap-2">
                <Form.Item
                  label="Tempat Lahir"
                  name="tempat_lahir"
                  className="w-full !mb-2"
                >
                  <Input
                    placeholder="Tempat Lahir"
                    maxLength={255}
                    onChange={handleInputChange((e) => {
                      form.setFieldsValue({ tempat_lahir: e.target.value });
                    })}
                    onPaste={handlePaste}
                  />
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
                  <Input
                    placeholder="Agama"
                    maxLength={255}
                    onChange={handleInputChange((e) => {
                      form.setFieldsValue({ agama: e.target.value });
                    })}
                    onPaste={handlePaste}
                  />
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
                    onChange={handleInputChange((e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ telp_rumah: value });
                    })}
                    onPaste={handlePaste}
                  />
                </Form.Item>
                <Form.Item label="Suku" name="suku" className="w-full !mb-2">
                  <Input
                    placeholder="Suku"
                    maxLength={255}
                    onChange={handleInputChange((e) => {
                      form.setFieldsValue({ suku: e.target.value });
                    })}
                    onPaste={handlePaste}
                  />
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
                    onChange={handleInputChange((e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ tinggi_badan: value });
                    })}
                    onPaste={handlePaste}
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
                    onChange={handleInputChange((e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ berat_badan: value });
                    })}
                    onPaste={handlePaste}
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
                    onChange={handleInputChange((e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ lingkar_kepala: value });
                    })}
                    onPaste={handlePaste}
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
                    onChange={handleInputChange((e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ anak_ke: value });
                    })}
                    onPaste={handlePaste}
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
                    onChange={handleInputChange((e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      form.setFieldsValue({ jumlah_saudara: value });
                    })}
                    onPaste={handlePaste}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="p-5 rounded-lg border border-gray-300 space-y-3">
              <p className="text-center font-semibold text-xl mb-2">Dokumen</p>

              <div className="space-y-2 border-t border-gray-300 pt-3">
                <p className="font-medium text-sm">Foto Ananda</p>
                {!avatar ? (
                  <Dropfile
                    id="avatar"
                    description="PNG dan JPG"
                    type="transparent"
                    onUpload={(file) => {
                      setAvatar(file);
                    }}
                  />
                ) : (
                  <FileItem
                    url={
                      avatar instanceof File
                        ? URL.createObjectURL(avatar as File)
                        : (avatar as string)
                    }
                    onSuccess={(url) => {
                      setUrlavatar(url);
                    }}
                    file={avatar || undefined}
                    onDelete={() => {
                      setAvatar(null);
                      setUrlavatar("");
                    }}
                  />
                )}
              </div>

              <div className="space-y-2 border-t border-gray-300 pt-3">
                <p className="font-medium text-sm">Akte Kelahiran</p>
                {!fileAkte ? (
                  <Dropfile
                    id="akte"
                    description="PNG dan JPG"
                    type="transparent"
                    onUpload={(file) => {
                      setFileAkte(file);
                    }}
                  />
                ) : (
                  <FileItem
                    url={
                      fileAkte instanceof File
                        ? URL.createObjectURL(fileAkte as File)
                        : (fileAkte as string)
                    }
                    onSuccess={(url) => {
                      form.setFieldValue("fileAkte", url);
                      setUrlAkte(url);
                    }}
                    file={fileAkte || undefined}
                    onDelete={() => {
                      setFileAkte(null);
                      setUrlAkte("");
                    }}
                  />
                )}
              </div>

              <div className="space-y-2 border-t border-gray-300 pt-3">
                <p className="font-medium text-sm">
                  Kartu Identitas Anak (KIA)
                </p>
                {!fileKia ? (
                  <Dropfile
                    id="kia"
                    description="PNG dan JPG"
                    type="transparent"
                    onUpload={(file) => {
                      setFileKia(file);
                    }}
                  />
                ) : (
                  <FileItem
                    url={
                      fileKia instanceof File
                        ? URL.createObjectURL(fileKia as File)
                        : (fileKia as string)
                    }
                    onSuccess={(url) => {
                      setUrlKia(url);
                    }}
                    file={fileKia || undefined}
                    onDelete={() => {
                      setFileKia(null);
                      setUrlKia("");
                    }}
                  />
                )}
              </div>

              <div className="space-y-2 border-t border-gray-300 pt-3">
                <p className="font-medium text-sm">Kartu Keluarga (KK)</p>
                {!fileKk ? (
                  <Dropfile
                    id="kk"
                    description="PNG dan JPG"
                    type="transparent"
                    onUpload={(file) => {
                      setFileKk(file);
                    }}
                  />
                ) : (
                  <FileItem
                    url={
                      fileKk instanceof File
                        ? URL.createObjectURL(fileKk as File)
                        : (fileKk as string)
                    }
                    onSuccess={(url) => {
                      setUrlKk(url);
                    }}
                    file={fileKk || undefined}
                    onDelete={() => {
                      setFileKk(null);
                      setUrlKk("");
                    }}
                  />
                )}
              </div>
            </div>

            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="w-full mt-4"
            >
              Simpan
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}

export default FormSiswa;
