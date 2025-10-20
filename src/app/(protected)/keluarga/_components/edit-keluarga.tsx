/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import { validateImage } from "@/lib/utils";
import KeluargaServices from "@/services/keluarga";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { EditIcon, Loader2Icon, XIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useEmojiValidation } from "@/hooks/use-emoji-validation";

function EditKeluarga({ keluargaId }: { keluargaId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hubunganValue, setHubunganValue] = useState("");
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [ktpFile, setFileKtp] = useState("");
  const { handleInputChange, handleTextAreaChange, handlePaste } =
    useEmojiValidation({
      fieldName: "Input",
    });

  const queryClient = useQueryClient();

  const { data: family, isLoading } = useQuery({
    queryKey: ["FAMILY", keluargaId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await KeluargaServices.getOne(keluargaId);
      return response;
    },
  });

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
      await KeluargaServices.update(keluargaId, {
        ...val,
        tanggal_lahir: moment(val?.tanggal_lahir).format("YYYY-MM-DD"),
      });
      queryClient.invalidateQueries({
        queryKey: ["FAMILY", keluargaId],
      });
      toast.success("Data berhasil diubah!");
      form.resetFields();
      setHubunganValue("");
      setFileKtp("");
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
      modal.onClose();
    }
  };

  useEffect(() => {
    if (family) {
      form.setFieldValue("nama", family.data.nama);
      form.setFieldValue("tanggal_lahir", dayjs(family.data.tanggal_lahir));
      form.setFieldValue("hubungan", family.data.hubungan);
      form.setFieldValue("pekerjaan", family.data.pekerjaan);
      form.setFieldValue("pendidikan", family.data.pendidikan);
      form.setFieldValue("gaji", family.data.gaji);
      form.setFieldValue("no_hp", family.data.no_hp);
      form.setFieldValue("agama", family.data.agama);
      form.setFieldValue("suku", family.data.suku);
      form.setFieldValue("nik", family.data.nik);
      form.setFieldValue("alamat", family.data.alamat);
      form.setFieldValue("jenis_kelamin", family.data.jenis_kelamin);
      if (!["Ayah", "Ibu", "Saudara"].includes(family.data.hubungan)) {
        setHubunganValue("Lainnya");
        form.setFieldValue("hubungan", family.data.hubungan);
      } else {
        setHubunganValue(family.data.hubungan);
      }
      if (family.data.ktp) {
        setFileKtp(family.data.ktp);
      }
    }
  }, [family, form]);

  return (
    <Tooltip title="Edit">
      <Button
        icon={<EditIcon className="w-5 h-5 !text-primary cursor-pointer" />}
        onClick={() => {
          modal.onOpen();
        }}
        type="text"
      ></Button>
      <Modal
        open={modal.isOpen}
        maskClosable={false}
        loading={isLoading}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
          setHubunganValue("");
          setFileKtp("");
        }}
        okText="Simpan"
        okButtonProps={{
          onClick: form.submit,
          disabled: !hubunganValue,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Keluarga</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
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
              onChange={handleInputChange((e) => {
                const value = e.target.value.replace(/\D/g, "");
                form.setFieldsValue({ nik: value });
              })}
              onPaste={handlePaste}
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

          <div className="space-y-2 !mb-2">
            <p>
              <span className="text-red-500">*</span> Hubungan
            </p>
            <Select
              placeholder="Pilih Hubungan"
              className="w-full"
              onChange={(val) => {
                setHubunganValue(val);
              }}
              value={hubunganValue || undefined}
              disabled
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
              <Input
                placeholder="Hubungan"
                maxLength={255}
                onChange={handleInputChange((e) => {
                  form.setFieldsValue({ hubungan: e.target.value });
                })}
                onPaste={handlePaste}
              />
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
                id={`ktp-${keluargaId}`}
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
                  htmlFor={`ktp-${keluargaId}`}
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
              <Input
                placeholder="Pekerjaan"
                maxLength={255}
                onChange={handleInputChange((e) => {
                  form.setFieldsValue({ pekerjaan: e.target.value });
                })}
                onPaste={handlePaste}
              />
            </Form.Item>
            <Form.Item
              label="Gaji"
              name="gaji"
              className="!mb-2 w-full"
              rules={[{ required: true, message: "Gaji harus diisi" }]}
            >
              <Input
                prefix="Rp. "
                placeholder="Gaji"
                maxLength={255}
                onChange={handleInputChange((e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  form.setFieldsValue({ gaji: value });
                })}
                onPaste={handlePaste}
              />
            </Form.Item>
          </div>
          <Form.Item
            label="Pendidikan"
            name="pendidikan"
            className="!mb-2"
            rules={[{ required: true, message: "Pendidikan harus diisi" }]}
          >
            <Input
              placeholder="Pendidikan"
              maxLength={255}
              onChange={handleInputChange((e) => {
                form.setFieldsValue({ pendidikan: e.target.value });
              })}
              onPaste={handlePaste}
            />
          </Form.Item>
          <Form.Item
            label="Nomor Telepon"
            name="no_hp"
            className="!mb-2"
            rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
          >
            <Input
              placeholder="Nomor Telepon"
              maxLength={255}
              onChange={handleInputChange((e) => {
                form.setFieldsValue({ no_hp: e.target.value });
              })}
              onPaste={handlePaste}
            />
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item
              label="Agama"
              name="agama"
              className="!mb-2 w-full"
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
            <Form.Item label="Suku" name="suku" className="!mb-2 w-full">
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
          <Form.Item
            label="Alamat"
            name="alamat"
            className="!mb-2"
            rules={[{ required: true, message: "Alamat harus diisi" }]}
          >
            <Input.TextArea
              placeholder="Alamat"
              maxLength={255}
              onChange={handleTextAreaChange((e) => {
                form.setFieldsValue({ alamat: e.target.value });
              })}
              onPaste={handlePaste}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditKeluarga;
