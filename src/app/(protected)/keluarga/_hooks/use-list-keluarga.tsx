import KeluargaServices from "@/services/keluarga";
import { TKeluarga } from "@/services/keluarga/keluarga.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import { DeleteKeluarga } from "../_components/delete-keluarga";
import EditKeluarga from "../_components/edit-keluarga";
import DetailKeluarga from "../_components/detail-keluarga";

type Props = {
  page: number;
  limit: number;
  siswa: number;
};

function useListKeluarga({ limit, page, siswa }: Props) {
  const { data: families, isLoading } = useQuery({
    queryKey: ["FAMILIES", siswa, page, limit],
    enabled: !!siswa && !!siswa,
    queryFn: async () => {
      const response = await KeluargaServices.get({
        page_size: limit,
        page,
        siswa,
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

  const columns: TableProps<TKeluarga>["columns"] = [
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
      title: "Hubungan",
      dataIndex: "hubungan",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value}</p>
      ),
    },
    {
      title: "Nomor Telepon",
      dataIndex: "no_hp",
      render: (value = "") => (
        <p style={{ textTransform: "uppercase" }}>{value}</p>
      ),
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            <EditKeluarga keluargaId={record.id} />
            <DeleteKeluarga keluargaId={record.id} />
            <DetailKeluarga keluarga={record} />
          </div>
        );
      },
    },
  ];
  return { columns, families, isLoading };
}

export default useListKeluarga;
