import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import AdmissionService from "@/services/admission";
import { TAdmission } from "@/services/admission/tagihan.type";
import moment from "moment";
import { PaymentAdmission } from "../_components/payment-admission";

type Props = {
  page: number;
  limit: number;
};

function useListAdmission({ limit, page }: Props) {
  const { siswaId } = useParams();
  const { data: bills, isLoading } = useQuery({
    queryKey: ["ADMISSIONS", page, limit, siswaId],
    queryFn: async () => {
      const response = await AdmissionService.get({
        page_size: limit,
        page,
        siswa: +siswaId,
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

  const columns: TableProps<TAdmission>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "nama",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value}</p>
      ),
    },
    {
      title: "Jumlah Cicilan",
      dataIndex: "cicilan",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value}</p>
      ),
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      render: (value = "") => (
        <p className="font-bold" style={{ textTransform: "uppercase" }}>
          {formatCurrency(value)}
        </p>
      ),
    },
    {
      title: "Uang Masuk",
      dataIndex: "pembayaran_sudah",
      render: (value = "") => (
        <p className="!text-green-500" style={{ textTransform: "uppercase" }}>
          {formatCurrency(value)}
        </p>
      ),
    },
    {
      title: "Sisa Pembayaran",
      dataIndex: "sisa_pembayaran",
      render: (value, record) => (
        <p className="!text-red-400" style={{ textTransform: "uppercase" }}>
          {formatCurrency(record.nominal - record.pembayaran_sudah)}
        </p>
      ),
    },
    {
      title: "Periode",
      dataIndex: "tanggal_mulai",
      render: (value, record) => (
        <p style={{ textTransform: "uppercase" }}>
          {moment(record.tanggal_mulai).format("LL")}-
          {moment(record.tanggal_berakhir).format("LL")}
        </p>
      ),
    },
    {
      title: "Lunas",
      dataIndex: "status",
      render: (value = "") =>
        value.toUpperCase() === "BELUM LUNAS" ? (
          <Tag color="red">Belum Lunas</Tag>
        ) : (
          <Tag color="green">Lunas</Tag>
        ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return record.status.toUpperCase() === "LUNAS" ? (
          "-"
        ) : (
          <div key={record.id} className="flex gap-[8px]">
            <PaymentAdmission tagihanId={record.id} type="auto" />
            <PaymentAdmission tagihanId={record.id} type="manual" />
          </div>
        );
      },
    },
  ];
  return { columns, bills, isLoading };
}

export default useListAdmission;
