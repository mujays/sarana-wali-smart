import { useDisclosure } from "@/hooks/use-disclosure";
import { TJemputan } from "@/services/jemputan/jemputan.type";
import { Button, Modal, Tooltip } from "antd";

export function DetailJemputan({ pickup }: { pickup: TJemputan }) {
  const modal = useDisclosure();

  return (
    <Tooltip title="Detail">
      <Button type="primary" onClick={() => modal.onOpen()}>
        Detail
      </Button>

      <Modal
        open={modal.isOpen}
        onCancel={() => {
          modal.onClose();
        }}
        cancelText="Tutup"
        footer={false}
        title="Detail Jemputan"
      >
        <div className="grid grid-cols-2 mb-3">
          <div>
            <p className="font-semibold">Nama Penjemput</p>
            <p>{pickup?.name}</p>
          </div>
          <div>
            <p className="font-semibold">Nomor Plat</p>
            <p>{pickup?.phone || "-"}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">Catatan</p>
          <p>{pickup?.note || "-"}</p>
        </div>
      </Modal>
    </Tooltip>
  );
}
