import { useDisclosure } from "@/hooks/use-disclosure";
import JemputanServices from "@/services/jemputan";
import { TJemputan } from "@/services/jemputan/jemputan.type";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, Tooltip } from "antd";
import { EyeIcon, Loader2Icon } from "lucide-react";
import { useQRCode } from "next-qrcode";

export function ShowCode({ pickup }: { pickup: TJemputan }) {
  const modal = useDisclosure();
  const { Canvas } = useQRCode();
  const { data: jemputan, isLoading } = useQuery({
    enabled: modal.isOpen,
    queryKey: ["PICKUP", pickup.id],
    queryFn: async () => {
      const response = await JemputanServices.getOne(pickup.id);
      return response;
    },
  });

  return (
    <Tooltip title="Generate">
      <Button
        icon={<EyeIcon className="w-5 h-5 !text-primary" />}
        type="text"
        onClick={() => modal.onOpen()}
      />

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
                )[0] as any;
                if (canvas) {
                  var url = canvas.toDataURL("image/png");
                  var link = document.createElement("a");
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
