import JemputanServices from "@/services/jemputan";
import { TJemputan } from "@/services/jemputan/jemputan.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Tag, Typography } from "antd";
import moment from "moment-timezone";
import "moment/locale/id";
import { ShowCode } from "../_components/show-code";
import { DetailJemputan } from "../_components/detail-jemputan";

type Props = {
  page: number;
  limit: number;
};

function useListJemputan({ limit, page }: Props) {
  const { data: jemputan, isLoading } = useQuery({
    queryKey: ["PICKUP", page, limit],
    queryFn: async () => {
      const response = await JemputanServices.get({
        page_size: limit,
        page,
        with: "siswa",
      });
      return response;
    },
    select(data) {
      return {
        ...data,
        data: data.data.map((keluarga, index) => ({
          ...keluarga,
          no: index + 1 + limit * page - limit,
        })),
      };
    },
  });

  const columns: TableProps<TJemputan>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Kode",
      dataIndex: "code",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value}</p>
      ),
    },
    {
      title: "Siswa",
      dataIndex: "siswa",
      render: (value, record) => (
        <p style={{ textTransform: "uppercase" }}>{record.siswa.nama}</p>
      ),
    },
    {
      title: "Waktu Jemput",
      dataIndex: "time_pickup",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>
          {value
            ? moment(value, "HH:mm:ss").add(7, "hours").format("HH:mm")
            : "-"}
        </p>
      ),
    },
    {
      title: "Expired Kode",
      dataIndex: "expired_at",
      render: (value = "") => {
        return (
          <p style={{ textTransform: "uppercase" }}>
            {value ? moment(value).format("LLL") : "-"}
          </p>
        );
      },
    },
    {
      title: "Tanggal",
      dataIndex: "date_pickup",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>
          {value ? moment(value).format("LL") : "-"}
        </p>
      ),
    },
    {
      title: "Terkonfirmasi",
      dataIndex: "status",
      render: (value: boolean) =>
        value ? <Tag color="green">Ya</Tag> : <Tag color="red">Belum</Tag>,
    },
    {
      title: "Sudah Sampai",
      dataIndex: "is_used",
      render: (value: boolean) =>
        value ? <Tag color="green">Ya</Tag> : <Tag color="red">Belum</Tag>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <DetailJemputan pickup={record} />
            <ShowCode pickup={record} />
          </div>
        );
      },
    },
  ];
  return { columns, jemputan, isLoading };
}

export default useListJemputan;
