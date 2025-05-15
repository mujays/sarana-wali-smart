/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import { validateImage } from "@/lib/utils";
import KeluargaServices from "@/services/keluarga";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

function AddKeluarga({ siswaId }: { siswaId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [ktpFile, setFileKtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [hubunganValue, setHubunganValue] = useState("");

  const queryClient = useQueryClient();

  const uploadProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoadingUpload(true);
      if (e.target.files) {
        const fileImg = e.target.files[0];
        validateImage({
          img: fileImg,
          extPermissions: ["image/jpg", "image/jpeg", "image/png", "image/PNG"],
          maxSize: 5000000,
        });

        const formData = new FormData();
        formData.append("upload", fileImg);
        const response = await axiosConfig.post("/upload", formData);
        setFileKtp(response.data.data);
      }
    } catch (error) {
      errorResponse(error as any);
    } finally {
      setIsLoadingUpload(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await KeluargaServices.create({
        ...val,
        tanggal_lahir: dayjs(val?.tanggal_lahir).format("YYYY-MM-DD"),
        hubungan: val?.hubungan || hubunganValue,
        siswa_id: siswaId,
        ktp: ktpFile,
      });
      queryClient.invalidateQueries({
        queryKey: ["FAMILIES", siswaId],
      });
      toast.success("Keluarga berhasil dibuat");
      form.resetFields();
      setHubunganValue("");
      setFileKtp("");
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => modal.onOpen()} icon={<PlusIcon />} type="primary">
        <span className="!hidden md:!inline">Tambah Keluarga</span>
      </Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
          setHubunganValue("");
          setFileKtp("");
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
          disabled: !hubunganValue,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Keluarga</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
            <Form.Item
              label="Nama"
              name="nama"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Nama harus diisi" }]}
            >
              <Input placeholder="Nama" maxLength={255} />
            </Form.Item>
            <Form.Item
              name="tanggal_lahir"
              label="Tanggal Lahir"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Tanggal lahir harus diisi" }]}
            >
              <DatePicker
                allowClear={false}
                format="DD/MM/YYYY"
                className="w-full"
              />
            </Form.Item>
          </div>
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
            className="w-full !mb-2"
            label="Jenis Kelamin"
            name="jenis_kelamin"
            rules={[{ required: true, message: "Jenis Kelamin harus diisi" }]}
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
          <div className="space-y-2 mb-2">
            <p>
              <span className="text-red-500">*</span> Hubungan
            </p>
            <Select
              placeholder="Pilih Hubungan"
              className="w-full !mb-2"
              onChange={(val) => {
                setHubunganValue(val);
              }}
              value={hubunganValue || undefined}
              options={[
                {
                  label: "Ayah",
                  value: "Ayah",
                },
                {
                  label: "Ibu",
                  value: "Ibu",
                },
                {
                  label: "Saudara",
                  value: "Saudara",
                },
                {
                  label: "Lainnya",
                  value: "Lainnya",
                },
              ]}
            />
          </div>
          {hubunganValue === "Lainnya" && (
            <Form.Item
              label="Hubungan Lainnya"
              name="hubungan"
              className="w-full !mb-2"
              rules={[{ required: true, message: "Hubungan harus diisi" }]}
            >
              <Input placeholder="Hubungan" maxLength={255} />
            </Form.Item>
          )}

          {["Ayah", "Ibu"].includes(hubunganValue) && (
            <div className="space-y-2 mb-2">
              <p>
                <span className="text-red-500">*</span> KTP
              </p>
              <input
                type="file"
                onChange={uploadProcess}
                name="ktp"
                id={`ktp-${siswaId}`}
                className="!hidden"
              />
              {isLoadingUpload ? (
                <div className="py-4 flex justify-center">
                  <Loader2Icon className="animate-spin" />
                </div>
              ) : ktpFile ? (
                <div className="flex justify-center relative">
                  <Image src={ktpFile} alt="KTP" width={500} height={300} />
                  <XIcon
                    className="z-10 cursor-pointer absolute -right-2 -top-2 text-white bg-black/45 rounded-full flex-shrink-0"
                    onClick={() => setFileKtp("")}
                  />
                </div>
              ) : (
                <label
                  htmlFor={`ktp-${siswaId}`}
                  className="flex border-blue-500 rounded-lg cursor-pointer hover:bg-blue-100 w-full h-20 border border-dashed justify-center items-center"
                >
                  Upload KTP
                </label>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Form.Item
              label="Pekerjaan"
              name="pekerjaan"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Pekerjaan harus diisi" }]}
            >
              <Input placeholder="Pekerjaan" maxLength={255} />
            </Form.Item>
            <Form.Item label="Gaji" name="gaji" className="!mb-2 w-full">
              <Input
                prefix="Rp. "
                placeholder="Gaji"
                maxLength={255}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  form.setFieldsValue({ gaji: value });
                }}
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Pendidikan"
            name="pendidikan"
            className="!mb-2"
            rules={[{ required: true, message: "Pendidikan harus diisi" }]}
          >
            <Input placeholder="Pendidikan" maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Nomor Telepon"
            name="no_hp"
            className="!mb-2"
            rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
          >
            <Input placeholder="Nomor Telepon" maxLength={255} />
          </Form.Item>

          <div className="flex gap-2">
            <Form.Item
              label="Agama"
              name="agama"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Agama harus diisi" }]}
            >
              <Input placeholder="Agama" maxLength={255} />
            </Form.Item>
            <Form.Item label="Suku" name="suku" className="!mb-2 w-full">
              <Input placeholder="Suku" maxLength={255} />
            </Form.Item>
          </div>
          <Form.Item
            label="Alamat"
            name="alamat"
            className="!mb-2"
            rules={[{ required: true, message: "Alamat harus diisi" }]}
          >
            <Input.TextArea placeholder="Alamat" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AddKeluarga;
