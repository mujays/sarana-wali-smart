import RiwayatServices from "@/services/riwayat";
import { TRiwayat } from "@/services/riwayat/riwayat.type";
import { useQuery } from "@tanstack/react-query";
import { TableProps, Typography } from "antd";
import { DeleteRiwayat } from "../_components/delete-riwayat";
import EditRiwayat from "../_components/edit-riwayat";

type Props = {
  page: number;
  limit: number;
  siswa: number;
};

function useListRiwayat({ limit, page, siswa }: Props) {
  const { data: riwayat, isLoading } = useQuery({
    queryKey: ["RIWAYAT", siswa, page, limit],
    enabled: !!siswa,
    queryFn: async () => {
      const response = await RiwayatServices.get({
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

  const columns: TableProps<TRiwayat>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Jenis Penyakit",
      dataIndex: "jenis_penyakit",
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
            <EditRiwayat riwayatId={record.id} />
            <DeleteRiwayat riwayatId={record.id} />
          </div>
        );
      },
    },
  ];
  return { columns, riwayat, isLoading };
}

export default useListRiwayat;
