"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { Table } from "antd";
import { useState } from "react";
import useListAdmission from "../hooks/useListAdmission";
import { useQuery } from "@tanstack/react-query";
import SiswaServices from "@/services/siswa";
import { useParams } from "next/navigation";

function UangPangkalPage() {
  const { siswaId } = useParams();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { data: siswa } = useQuery({
    queryKey: ["STUDENT", siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(siswaId as string), {});
      return response.data;
    },
  });

  const { columns, isLoading, bills } = useListAdmission({
    limit: pagination.pageSize,
    page: pagination.page,
  });

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
              title: "Tagihan Lainnya",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Tagihan Lainnya {siswa?.nama}</p>
      </div>

      <div className="overflow-auto">
        <Table
          id="admission-table"
          columns={columns}
          dataSource={bills?.data}
          loading={isLoading}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
            total: bills?.meta.total,
            pageSize: pagination.pageSize,
            current: pagination.page,
          }}
        />
      </div>
    </div>
  );
}

export default UangPangkalPage;
