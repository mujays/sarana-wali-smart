import { formatCurrency } from "@/lib/utils";
import TagihanService from "@/services/tagihan";
import { TTagihan } from "@/services/tagihan/tagihan.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import AutoPayment from "../_components/auto-payment";
import { ManualPayment } from "../_components/manual-payment";

type Props = {
  page: number;
  limit: number;
  tahunAjaranId: number;
};

function useListTagihan({ limit, page, tahunAjaranId }: Props) {
  const { siswaId } = useParams();
  const { data: bills, isLoading } = useQuery({
    queryKey: ["BILLS", page, limit, siswaId, tahunAjaranId],
    enabled: !!tahunAjaranId,
    queryFn: async () => {
      const response = await TagihanService.get({
        page_size: limit,
        page,
        siswa: +siswaId,
        tahun_ajaran: tahunAjaranId,
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((bill, index) => ({
          ...bill,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TTagihan>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "tagihan",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value || "SPP"}</p>
      ),
    },
    {
      title: "Biaya",
      dataIndex: "biaya",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{formatCurrency(value)}</p>
      ),
    },
    {
      title: "Jatuh Tempo",
      dataIndex: "jatuh_tempo",
      render: (value = "", record) => (
        <p style={{ textTransform: "uppercase" }}>
          {new Date(value).getDate()} {record?.bulan}
        </p>
      ),
    },
    {
      title: "Lunas",
      dataIndex: "is_lunas",
      render: (value = "") =>
        value ? (
          <Tag color="green">Lunas</Tag>
        ) : (
          <Tag color="red">Belum Lunas</Tag>
        ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return record?.is_lunas ? (
          "-"
        ) : (
          <div key={record?.id} className="flex gap-[8px]">
            <ManualPayment tagihanId={record?.id} />
            <AutoPayment tagihanId={record?.id} />
          </div>
        );
      },
    },
  ];
  return { columns, bills, isLoading };
}

export default useListTagihan;
