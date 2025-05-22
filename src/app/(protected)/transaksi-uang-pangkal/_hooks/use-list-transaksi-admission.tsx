import { formatCurrency } from "@/lib/utils";
import AdmissionService from "@/services/admission";
import { TTransactionAdmission } from "@/services/admission/tagihan.type";
import { useQuery } from "@tanstack/react-query";
import { Image, TableProps, Tag, Typography } from "antd";
import moment from "moment";
import "moment/locale/id";
import { Invoices } from "../../transaksi-tagihan/_components/Invoices";

type Props = {
  page: number;
  limit: number;
};

function useListTransaksiAdmission({ limit, page }: Props) {
  const { data: students, isLoading } = useQuery({
    queryKey: ["TRX", page, limit],
    queryFn: async () => {
      const response = await AdmissionService.getTrx({
        page_size: limit,
        page,
        with: "uang_pangkal.siswa",
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

  const columns: TableProps<TTransactionAdmission>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "uang_pangkal",
      render: (text: string, record) => (
        <Typography.Text>{record?.uang_pangkal?.nama}</Typography.Text>
      ),
      align: "center",
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
      render: (value = "") => <p>{formatCurrency(value) || "-"}</p>,
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
      title: "Bukti Pembayaran",
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
    {
      title: "Invoice",
      dataIndex: "transaksi",
      render: (value, record) =>
        record.status.toUpperCase() === "BERHASIL" ? (
          <Invoices transactions={record} />
        ) : (
          "-"
        ),
    },
  ];
  return { columns, students, isLoading };
}

export default useListTransaksiAdmission;
