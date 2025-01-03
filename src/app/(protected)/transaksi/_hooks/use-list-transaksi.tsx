import TagihanService from "@/services/tagihan";
import { TTransaction } from "@/services/tagihan/tagihan.type";
import { useQuery } from "@tanstack/react-query";
import { Image, TableProps, Tag, Typography } from "antd";
import moment from "moment";
import "moment/locale/id";

type Props = {
  page: number;
  limit: number;
};

function useListTransaksi({ limit, page }: Props) {
  const { data: students, isLoading } = useQuery({
    queryKey: ["TRX", page, limit],
    queryFn: async () => {
      const response = await TagihanService.getTrx({
        page_size: limit,
        page,
        // with: "tagihan",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((siswa, index) => ({
          ...siswa,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TTransaction>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "ID Ipaymu",
      dataIndex: "transaction_id_ipaymu",
      render: (value = "") => <p>{value || "-"}</p>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value = "") =>
        value.toLowerCase() === "berhasil" ? (
          <Tag color="green" className="capitalize">
            {value}
          </Tag>
        ) : value.toLowerCase() === "pending" ? (
          <Tag color="orange" className="capitalize">
            {value}
          </Tag>
        ) : (
          <Tag color="red" className="capitalize">
            {value}
          </Tag>
        ),
    },
    {
      title: "Harga",
      dataIndex: "buyer_payment",
      render: (value = "") => <p>{value || "-"}</p>,
    },
    {
      title: "Metode Pembayaran",
      dataIndex: "payment_method",
      render: (value = "") => <p>{value || "-"}</p>,
    },
    {
      title: "Tanggal Dibayarkan",
      dataIndex: "payment_at",
      render: (value = "") => <p>{value ? moment(value).format("LL") : "-"}</p>,
    },
    {
      title: "Tanggal Dibayarkan",
      dataIndex: "bukti_pembayaran",
      render: (value = "") =>
        value ? (
          <Image
            src={value}
            className="!w-20 !h-20 object-cover"
            alt="bukti transfer"
          />
        ) : (
          "-"
        ),
    },
  ];
  return { columns, students, isLoading };
}

export default useListTransaksi;
