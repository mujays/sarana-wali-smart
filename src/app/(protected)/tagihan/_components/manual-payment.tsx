/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import { validateImage } from "@/lib/utils";
import TagihanService from "@/services/tagihan";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Image, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function ManualPayment({ tagihanId }: { tagihanId: number }) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = React.useState(false);
  const [proofPayment, setProofPayment] = React.useState("");

  async function handlePayment() {
    try {
      setIsLoadingUpload(true);
      await TagihanService.payment(tagihanId, {
        via: "Manual",
        bukti_pembayaran: proofPayment,
      });
      toast.success("Bukti pembayaran berhasil dikirim!");
      queryClient.resetQueries({ queryKey: ["BILL"] });
      modal.onClose();
    } catch (error) {
      errorResponse(error as AxiosError);
    } finally {
      setIsLoadingUpload(false);
    }
  }

  const uploadProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
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
        setProofPayment(response.data.data);
        console.log({ response });
      }
    } catch (error) {
      errorResponse(error as any);
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  console.log({ proofPayment });

  return (
    <Tooltip title="Pembayaran">
      <Button type="primary" onClick={() => modal.onOpen()}>
        Bayar Manual
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            Upload Bukti Pembayaran
          </Typography.Title>
        }
        maskClosable={false}
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Konfirmasi"
        okButtonProps={{
          loading: isLoadingUpload,
        }}
        onOk={handlePayment}
        confirmLoading={isLoadingUpload}
      >
        <input
          type="file"
          onChange={uploadProcess}
          name="proof"
          id="proof"
          className="hidden"
        />
        {isLoading ? (
          <div className="py-4 flx justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : proofPayment ? (
          <div className="flex justify-center">
            <Image src={proofPayment} alt="bukti pembayaran" />
          </div>
        ) : (
          <label
            htmlFor="proof"
            className="flex border-blue-500 rounded-lg cursor-pointer hover:bg-blue-100 w-full h-20 border border-dashed justify-center items-center"
          >
            Upload Bukti Pembayaran
          </label>
        )}
      </Modal>
    </Tooltip>
  );
}
