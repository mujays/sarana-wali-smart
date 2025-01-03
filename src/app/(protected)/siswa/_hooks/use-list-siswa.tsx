import SiswaServices from "@/services/siswa";
import { TSiswa } from "@/services/siswa/siswa.type";
import { useQuery } from "@tanstack/react-query";
import { Button, TableProps, Tooltip, Typography } from "antd";
import { EyeIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  page: number;
  limit: number;
  isTagihan?: boolean;
};

function useListSiswa({ limit, page, isTagihan }: Props) {
  const router = useRouter();
  const pn = usePathname();
  const { data: students, isLoading } = useQuery({
    queryKey: ["STUDENTS", page, limit],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: limit,
        page,
        with: "kelas",
        // siswa_lama: true,
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

  const columns: TableProps<TSiswa>["columns"] = [
    {
      title: "No",
      dataIndex: "no",
      render: (text: string) => <Typography.Text>{text}</Typography.Text>,
      align: "center",
    },
    {
      title: "Nama",
      dataIndex: "nama",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "NIS",
      dataIndex: "nis",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "NISN",
      dataIndex: "nisn",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Tingkat",
      dataIndex: "type",
      render: (value = "") => <p>{value}</p>,
    },
    {
      title: "Action",
      key: "",
      render: (value, record) => {
        return (
          <div key={record.id} className="flex gap-[8px]">
            {isTagihan ? (
              <Button
                onClick={() => router.push(`${pn}/${record.id}`)}
                type="primary"
              >
                Lihat Tagihan
              </Button>
            ) : (
              <Tooltip title="Detail">
                <Button
                  onClick={() => router.push(`${pn}/${record.id}`)}
                  type="text"
                  icon={<EyeIcon className="!text-indigo-500" />}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  return { columns, students, isLoading };
}

export default useListSiswa;
