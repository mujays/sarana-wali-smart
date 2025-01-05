"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { Table } from "antd";
import { useState } from "react";
import useListJemputan from "../_hooks/use-list-jemputan";
import { GenerateJemputan } from "./generate-code";

function JemputanPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, jemputan } = useListJemputan({
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
              title: "Jemputan",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Jemputan</p>
      </div>
      <div className="flex justify-end">
        <GenerateJemputan />
      </div>
      <div className="overflow-auto">
        <Table
          id="pickup-table"
          columns={columns}
          dataSource={jemputan?.data}
          loading={isLoading}
          pagination={{
            onChange: (page, pageSize) => {
              setPagination({ page, pageSize });
            },
            total: jemputan?.meta.total,
            pageSize: pagination.pageSize,
            current: pagination.page,
          }}
        />
      </div>
    </div>
  );
}

export default JemputanPage;
