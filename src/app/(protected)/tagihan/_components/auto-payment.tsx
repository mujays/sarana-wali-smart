import TagihanService from "@/services/tagihan";
import { Button } from "antd";
import { useState } from "react";
import { toast } from "sonner";

function AutoPayment({ tagihanId }: { tagihanId: number }) {
  const [loadingPayment, setLoadingPayment] = useState(false);

  const handlePayment = async () => {
    try {
      setLoadingPayment(true);
      const res = await TagihanService.payment(tagihanId);
      if (res.data?.Url) {
        window.location.href = res.data.Url;
      }
    } catch {
      toast.error("Error payment");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <Button loading={loadingPayment} onClick={handlePayment} type="primary">
      Bayar Otomatis
    </Button>
  );
}

export default AutoPayment;
