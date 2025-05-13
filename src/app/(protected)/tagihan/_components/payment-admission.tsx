/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosConfig from "@/configs/axios";
import { useDisclosure } from "@/hooks/use-disclosure";
import errorResponse from "@/lib/error";
import { validateImage } from "@/lib/utils";
import AdmissionService from "@/services/admission";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Image, Input, Modal, Tooltip, Typography } from "antd";
import { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export function PaymentAdmission({
  tagihanId,
  type,
}: {
  tagihanId: number;
  type: "manual" | "auto";
}) {
  const queryClient = useQueryClient();
  const modal = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = React.useState(false);
  const [proofPayment, setProofPayment] = React.useState("");
  const [nominal, setNominal] = React.useState("");

  async function handlePayment() {
    try {
      setIsLoadingUpload(true);
      if (type === "manual") {
        await AdmissionService.payment(tagihanId, {
          via: "manual",
          nominal,
          bukti_pembayaran: proofPayment,
        });
      }
      if (type === "auto") {
        const res = await AdmissionService.payment(tagihanId, {
          via: "Ipaymu",
          nominal,
        });
        if (res.data?.url) {
          window.open(res.data.url, "_blank");
        }
      }
      toast.success("Bukti pembayaran berhasil dikirim!");
      queryClient.resetQueries({ queryKey: ["ADMISSIONS"] });
      modal.onClose();
      setProofPayment("");
      setNominal("");
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
      }
    } catch (error) {
      errorResponse(error as any);
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  return (
    <Tooltip title="Pembayaran">
      <Button
        type={type !== "manual" ? "primary" : "default"}
        onClick={() => modal.onOpen()}
      >
        {type === "manual" ? "Bayar Manual" : "Bayar Otomatis"}
      </Button>

      <Modal
        title={
          <Typography.Title className="font-normal" level={3}>
            {type === "manual" ? "Upload Bukti Pembayaran" : "Masukkan Nominal"}
          </Typography.Title>
        }
        maskClosable={false}
        open={modal.isOpen}
        onCancel={() => modal.onClose()}
        okText="Konfirmasi"
        okButtonProps={{
          loading: isLoadingUpload,
          disabled:
            type === "auto"
              ? !nominal || +nominal < 10000
              : !nominal || !proofPayment || +nominal < 10000,
        }}
        onOk={handlePayment}
        confirmLoading={isLoadingUpload}
      >
        {type === "manual" && (
          <>
            <input
              type="file"
              onChange={uploadProcess}
              name="proof"
              id="proof"
              className="hidden"
            />
            {isLoading ? (
              <div className="py-4 flex justify-center">
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
          </>
        )}
        <div className="pt-4">
          <Input
            type="number"
            placeholder="Nominal"
            prefix="Rp."
            min={9000}
            value={nominal}
            className="!w-full"
            onChange={(e) => setNominal(e.target.value)}
          />
          <p className="text-gray-400 text-sm">Minimal pembayaran Rp. 10.000</p>
        </div>
      </Modal>
    </Tooltip>
  );
}
