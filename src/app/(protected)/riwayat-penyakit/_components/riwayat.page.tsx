"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import SiswaServices from "@/services/siswa";
import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "antd";
import { useEffect, useState } from "react";
import useListRiwayat from "../_hooks/use-list-riwayat";
import AddRiwayat from "./add-riwayat";

function RiwayatPage() {
  const [siswaId, setSiswaId] = useState<null | number>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, riwayat } = useListRiwayat({
    limit: pagination.pageSize,
    page: pagination.page,
    siswa: siswaId as number,
  });

  const { data: students } = useQuery({
    queryKey: ["STUDENTS"],
    queryFn: async () => {
      const response = await SiswaServices.get({
        page_size: 100000,
        page: 1,
      });
      return response;
    },
  });

  useEffect(() => {
    if (students) {
      setSiswaId(students.data[0].id);
    }
  }, [students]);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <AppBreadcrumbs
          items={[
            {
              title: "Home",
              url: "/",
            },
            {
              title: "Siswa",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Data Siswa</p>
      </div>

      <div className="flex items-end justify-between flex-wrap gap-[8px]">
        <div>
          <p className="pb-1 font-medium">Siswa</p>
          <Select
            value={siswaId}
            onChange={(val) => {
              setSiswaId(val);
            }}
            placeholder="Tipe"
            className="w-40"
            options={students?.data.map((stu) => ({
              label: stu.nama,
              value: stu.id,
            }))}
          />
        </div>

        <AddRiwayat siswaId={siswaId as number} />
      </div>

      <div className="overflow-auto">
        <Table
          id="riwayat-table"
          columns={columns}
          dataSource={riwayat?.data}
          loading={isLoading || !siswaId}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
            total: riwayat?.meta.total,
            pageSize: pagination.pageSize,
            current: pagination.page,
          }}
        />
      </div>
    </div>
  );
}

export default RiwayatPage;
