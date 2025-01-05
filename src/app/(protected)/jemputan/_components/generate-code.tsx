import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import JemputanServices from "@/services/jemputan";
import SiswaServices from "@/services/siswa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Select, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { BusIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function GenerateJemputan() {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: students } = useQuery({
    queryKey: ["STUDENTS"],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: 100000,
        page: 1,
      });
      return response;
    },
  });

  async function onSubmit(val: any) {
    console.log(val);
    try {
      setIsLoading(true);
      await JemputanServices.generate(val?.siswaId);
      toast.success("Data berhasil digenerate!");
      queryClient.resetQueries({ queryKey: ["PICKUP"] });
      modal.onClose();
      form.resetFields();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tooltip title="Generate">
      <Button
        icon={<BusIcon className="w-5 h-5" />}
        type="primary"
        onClick={() => modal.onOpen()}
      >
        Buat Jemputan
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Generate Kode Jemputan
          </Typography.Title>
        }
        open={modal.isOpen}
        onCancel={() => {
          modal.onClose();
          form.resetFields();
        }}
        okText="Generate"
        okButtonProps={{
          loading: isLoading,
          onClick: form.submit,
        }}
      >
        <Form form={form} requiredMark layout="vertical" onFinish={onSubmit}>
          <div className="flex gap-2">
            <Form.Item
              label="Siswa"
              name="siswaId"
              className="w-full mb-2"
              rules={[{ required: true, message: "Siswa harus diisi" }]}
            >
              <Select
                placeholder="Siswa"
                className="w-40"
                options={students?.data.map((stu) => ({
                  label: stu.nama,
                  value: stu.id,
                }))}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Tooltip>
  );
}
