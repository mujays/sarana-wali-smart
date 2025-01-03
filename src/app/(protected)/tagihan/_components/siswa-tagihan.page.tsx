"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { Table } from "antd";
import { useState } from "react";
import useListSiswa from "../../siswa/_hooks/use-list-siswa";

function SiswaPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, students } = useListSiswa({
    limit: pagination.pageSize,
    page: pagination.page,
    isTagihan: true,
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
              title: "Tagihan Siswa",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Pilih Siswa</p>
      </div>

      <div className="overflow-auto">
        <Table
          id="siswa-table"
          columns={columns}
          rowKey={(obj) => obj.nik}
          dataSource={students?.data}
          loading={isLoading}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
            total: students?.meta.total,
            pageSize: pagination.pageSize,
            current: pagination.page,
          }}
        />
      </div>
    </div>
  );
}

export default SiswaPage;
