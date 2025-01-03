/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import { formatCurrency } from "@/lib/utils";
import SiswaServices from "@/services/siswa";
import TagihanService from "@/services/tagihan";
import { useQuery } from "@tanstack/react-query";
import { Select, Table } from "antd";
import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useListTagihan from "../hooks/useListTagihan";

function DetailTagihanSiswa() {
  const { siswaId } = useParams();
  const [tahunAjaranId, setTahunAjaranId] = useState<null | number>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { columns, isLoading, bills } = useListTagihan({
    limit: pagination.pageSize,
    page: pagination.page,
    tahunAjaranId: tahunAjaranId as number,
  });

  const { data: siswa } = useQuery({
    queryKey: ["STUDENT", siswaId],
    enabled: !!siswaId,
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(siswaId as string), {});
      return response.data;
    },
  });

  const { data: tahunAjaran } = useQuery({
    queryKey: ["ACADEMIC"],
    queryFn: async () => {
      const response = await TagihanService.getTahunAjaran({
        page_size: 1000000,
        page: 1,
      });
      return response;
    },
  });

  const { data: billMonthly, isLoading: loadingMontly } = useQuery({
    queryKey: ["BILL_MONTHLY", siswaId, tahunAjaranId],
    enabled: !!siswa && !!tahunAjaran && !!tahunAjaranId,
    queryFn: async () => {
      const response = await TagihanService.get({
        tahun_ajaran: tahunAjaranId,
        bulanan: true,
        siswa: siswaId,
      });
      return response.data;
    },
  });
  console.log({ tahunAjaran });
  useEffect(() => {
    if (tahunAjaran) {
      setTahunAjaranId(tahunAjaran?.data.data[0].id);
    }
  }, [tahunAjaran]);
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
              url: "/tagihan",
            },
            {
              title: "Detail Tagihan",
              url: "#",
            },
          ]}
        />
        <p className="text-xl font-medium">Detail Tagihan Siswa</p>
      </div>

      <div className="border p-4 rounded-lg space-y-3">
        <div className="flex justify-between">
          <p className="font-medium text-xl">Tagihan Bulanan</p>

          <Select
            value={tahunAjaranId}
            onChange={(val) => {
              setTahunAjaranId(val);
            }}
            placeholder="Tahun Ajaran"
            className="w-40"
            options={tahunAjaran?.data?.data.map(
              (ta: { name: string; id: string }) => ({
                label: ta.name,
                value: ta.id,
              })
            )}
          />
        </div>

        {loadingMontly ? (
          <div className="flex justify-center py-20">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Object.entries(billMonthly || {}).map(([month, value]) => (
              <div key={month} className="rounded border">
                <div className="bg-gray-200 flex items-center justify-center h-10 font-medium">
                  {month}
                </div>
                <div className="flex justify-center py-3">
                  {formatCurrency(value as unknown as number)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-3 space-y-3 border rounded">
          <div className="overflow-auto">
            <Table
              id="bill-table"
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
      </div>
    </div>
  );
}

export default DetailTagihanSiswa;
