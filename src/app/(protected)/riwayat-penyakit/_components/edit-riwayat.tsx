/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import RiwayatServices from "@/services/riwayat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function EditRiwayat({ riwayatId }: { riwayatId: number }) {
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { data: riwayat, isLoading } = useQuery({
    queryKey: ["riwayat_one", riwayatId],
    enabled: modal.isOpen,
    queryFn: async () => {
      const response = await RiwayatServices.getOne(riwayatId);
      return response;
    },
  });

  const onSubmit = async (val: any) => {
    try {
      setLoading(true);
      await RiwayatServices.update(riwayatId, {
        ...val,
      });
      queryClient.invalidateQueries({
        queryKey: ["riwayat_one", riwayatId],
      });
      queryClient.resetQueries({
        queryKey: ["RIWAYAT"],
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
    if (riwayat) {
      form.setFieldValue("jenis_penyakit", riwayat.data.jenis_penyakit);
    }
  }, [riwayat, modal]);

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
        title={<Typography.Title level={4}>Edit Riwayat</Typography.Title>}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
            <Form.Item
              label="Jenis Penyakit"
              name="jenis_penyakit"
              className="w-full mb-2"
              rules={[
                { required: true, message: "Jenis Penyakit harus diisi" },
              ]}
            >
              <Input placeholder="Jenis Penyakit" maxLength={255} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Tooltip>
  );
}

export default EditRiwayat;
