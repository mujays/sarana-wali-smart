/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import KeluargaServices from "@/services/keluarga";
import { useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, Modal, Typography } from "antd";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

function AddKeluarga({ siswaId }: { siswaId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await KeluargaServices.create({
        ...val,
        tanggal_lahir: moment(val?.tanggal_lahir).format("YYYY-MM-DD"),
        siswa_id: siswaId,
      });
      queryClient.invalidateQueries({
        queryKey: ["FAMILIES", siswaId],
      });
      toast.success("Keluarga berhasil dibuat");
      form.resetFields();
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
        }}
        okText="Tambah"
        okButtonProps={{
          onClick: form.submit,
        }}
        confirmLoading={loading}
        title={<Typography.Title level={4}>Tambah Keluarga</Typography.Title>}
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
            <Input placeholder="Hubungan" maxLength={255} />
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
    </>
  );
}

export default AddKeluarga;
