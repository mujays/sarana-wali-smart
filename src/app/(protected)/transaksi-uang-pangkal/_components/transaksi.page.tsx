"use client";
import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { Table } from "antd";
import { useState } from "react";
import useListTransaksiAdmission from "../_hooks/use-list-transaksi-admission";

function TransaksiPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, students } = useListTransaksiAdmission({
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
              title: "Transaksi",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Transaksi Uang Pangkal</p>
      </div>

      <div className="overflow-auto">
        <Table
          id="transaksi-table"
          columns={columns}
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

export default TransaksiPage;
