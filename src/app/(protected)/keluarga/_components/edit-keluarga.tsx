/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import KeluargaServices from "@/services/keluarga";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Tooltip,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { EditIcon } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditKeluarga({ keluargaId }: { keluargaId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: family, isLoading } = useQuery({
    queryKey: ["FAMILY", keluargaId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await KeluargaServices.getOne(keluargaId);
      return response;
    },
  });

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
    }
  }, [family, modal]);

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
        }}
        okText="Simpan"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Edit Keluarga</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
            <Form.Item
              label="Nama"
              name="nama"
              className="w-full mb-2"
              rules={[{ required: true, message: "Nama harus diisi" }]}
            >
              <Input placeholder="Nama" maxLength={255} />
            </Form.Item>
            <Form.Item
              name="tanggal_lahir"
              label="Tanggal Lahir"
              className="mb-2 w-full"
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
            label="Hubungan"
            name="hubungan"
            className="w-full mb-2"
            rules={[{ required: true, message: "Hubungan harus diisi" }]}
          >
            <Input
              placeholder="Hubungan"
              maxLength={255}
              disabled={["Ayah", "Ibu"].includes(
                family?.data?.hubungan as string
              )}
            />
          </Form.Item>
          <div className="flex gap-2">
            <Form.Item
              label="Pekerjaan"
              name="pekerjaan"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Pekerjaan harus diisi" }]}
            >
              <Input placeholder="Pekerjaan" maxLength={255} />
            </Form.Item>
            <Form.Item
              label="Gaji"
              name="gaji"
              className="mb-2 w-full"
              rules={[{ required: true, message: "Gaji harus diisi" }]}
            >
              <Input prefix="Rp. " placeholder="Gaji" maxLength={255} />
            </Form.Item>
          </div>
          <Form.Item
            label="Pendidikan"
            name="pendidikan"
            className="mb-2"
            rules={[{ required: true, message: "Pendidikan harus diisi" }]}
          >
            <Input placeholder="Pendidikan" maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Nomor Telepon"
            name="no_hp"
            className="mb-2"
            rules={[{ required: true, message: "Nomor Telepon harus diisi" }]}
          >
            <Input placeholder="Nomor Telepon" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditKeluarga;
