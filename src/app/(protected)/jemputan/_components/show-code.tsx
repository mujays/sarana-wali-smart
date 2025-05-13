import { useDisclosure } from "@/hooks/use-disclosure";
import JemputanServices from "@/services/jemputan";
import { TJemputan } from "@/services/jemputan/jemputan.type";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Tooltip } from "antd";
import { Loader2Icon } from "lucide-react";
import { useQRCode } from "next-qrcode";

export function ShowCode({ pickup }: { pickup: TJemputan }) {
  const modal = useDisclosure();
  const { Canvas } = useQRCode();
  const { isLoading } = useQuery({
    enabled: modal.isOpen,
    queryKey: ["PICKUP", pickup.id],
    queryFn: async () => {
      const response = await JemputanServices.getOne(pickup.id);
      return response;
    },
  });

  return (
    <Tooltip title="Generate">
      <Button type="dashed" onClick={() => modal.onOpen()}>
        Kode
      </Button>

      <Modal
        open={modal.isOpen}
        onCancel={() => {
          modal.onClose();
        }}
        cancelText="Tutup"
        footer={false}
      >
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Canvas
              text={pickup.code}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: "#000000",
                  light: "#ffffff",
                },
              }}
            />
            <p className="pb-3 font-medium text-xl">{pickup.code}</p>
            <Button
              onClick={() => {
                const canvas = document.getElementsByTagName(
                  "canvas"
                )[0] as HTMLCanvasElement;
                if (canvas) {
                  const url = canvas.toDataURL("image/png");
                  const link = document.createElement("a");
                  link.download = `${pickup?.code}.png`;
                  link.href = url;
                  link.click();
                }
              }}
            >
              Simpan QR Code
            </Button>
          </div>
        )}
      </Modal>
    </Tooltip>
  );
}
