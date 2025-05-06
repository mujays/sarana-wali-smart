"use client";

import AppBreadcrumbs from "@/components/common/app-breadcrums";
import SiswaServices from "@/services/siswa";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton } from "antd";
import { DownloadIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { Image as ImageAntd } from "antd";
import moment from "moment";

function SiswaDetail() {
  const { id } = useParams();
  const [imageData, setImageData] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);
  const { data: siswa, isLoading } = useQuery({
    queryKey: ["SISWA", id],
    queryFn: async () => {
      const response = await SiswaServices.getOne(+(id as string));
      return response;
    },
  });

  const dataAyah = useMemo(() => {
    if (siswa) {
      return siswa?.data?.keluarga?.filter(
        (kel) => kel.hubungan === "Orang Tua"
      )[0];
    }

    return null;
  }, [siswa]);

  const dataIbu = useMemo(() => {
    if (siswa) {
      return siswa?.data?.keluarga?.filter(
        (kel) => kel.hubungan === "Orang Tua"
      )[1];
    }

    return null;
  }, [siswa]);

  const generateImage = async () => {
    try {
      if (pdfRef?.current) {
        const clonedElement = pdfRef.current.cloneNode(true) as HTMLDivElement;
        clonedElement.style.display = "block";
        clonedElement.style.width = "1240px";

        clonedElement.style.position = "absolute";
        clonedElement.style.left = "-999999px";

        document.body.appendChild(clonedElement);
        const canvas = await html2canvas(clonedElement, { scale: 2 });
        const imageData = canvas.toDataURL("image/png");
        document.body.removeChild(clonedElement);
        setImageData(imageData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (siswa?.data) {
      generateImage();
    }
  }, [pdfRef, siswa]);

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
              url: "/siswa",
            },
          ]}
        />
        <p className="text-xl font-medium">{siswa?.data?.nama}</p>
      </div>

      {isLoading ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        <div className="p-5 space-y-4">
          <div className="flex justify-between">
            <p className="font-bold text-2xl">Informasi Siswa</p>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const pdf = new jsPDF("portrait", "mm", "a4");
                  const imgWidth = 210;
                  const imgHeight = 297;
                  pdf.addImage(
                    imageData,
                    "PNG",
                    0,
                    0,
                    imgWidth,
                    imgHeight,
                    undefined,
                    "FAST"
                  );
                  pdf.save(`${siswa?.data?.nama}-${siswa?.data?.nik}.pdf`);
                }}
                icon={<DownloadIcon className="text-white w-4 h-4" />}
                type="primary"
              >
                Download
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-xl">Berkas</p>
            <div className="flex gap-4">
              {dataAyah?.ktp && (
                <div className="flex flex-col items-center">
                  <ImageAntd
                    src={dataAyah.ktp}
                    className="!w-32 aspect-video overflow-hidden"
                  />
                  <p>KTP Ayah</p>
                </div>
              )}

              {dataIbu?.ktp && (
                <div className="flex flex-col items-center">
                  <ImageAntd
                    src={dataIbu.ktp}
                    className="!w-32 aspect-video overflow-hidden"
                  />
                  <p>KTP Ibu</p>
                </div>
              )}

              {siswa?.data?.url_kia && (
                <div className="flex flex-col items-center">
                  <ImageAntd
                    src={siswa?.data?.url_kia}
                    className="!w-32 aspect-video overflow-hidden"
                  />
                  <p>KIA</p>
                </div>
              )}

              {siswa?.data?.url_akta && (
                <div className="flex flex-col items-center">
                  <ImageAntd
                    src={siswa?.data?.url_akta}
                    className="!w-32 aspect-video overflow-hidden"
                  />
                  <p>Akte</p>
                </div>
              )}

              {siswa?.data?.url_kk && (
                <div className="flex flex-col items-center">
                  <ImageAntd
                    src={siswa?.data?.url_kk}
                    className="!w-32 aspect-video overflow-hidden"
                  />
                  <p>Kartu Keluarga</p>
                </div>
              )}
            </div>
          </div>
          <div
            ref={pdfRef}
            className="space-y-5 text-sm border bg-white shadow-lg rounded-lg p-5"
          >
            <div className="space-y-3">
              <div className="bg-blue-500 text-center text-white !mt-0">
                DATA CALON SISWA
              </div>

              <div className="flex justify-between items-center text-xs gap-4">
                <div className="basis-9/12 space-y-1">
                  <div className="flex gap-3">
                    <p className="w-[150px]">Nama Lengkap</p>
                    <p>: {siswa?.data?.nama}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Tempat Tanggal Lahir</p>
                    <p>
                      : {siswa?.data?.tempat_lahir},{" "}
                      {moment(siswa?.data?.tanggal_lahir).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">NIK</p>
                    <p>: {siswa?.data?.nik}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">NIS</p>
                    <p>: {siswa?.data?.nis}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">NISN</p>
                    <p>: {siswa?.data?.nisn}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Jenis Kelamin</p>
                    <p>: {siswa?.data?.jenis_kelamin || "-"}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Tinggi Badan</p>
                    <p>: {siswa?.data?.tinggi_badan} cm</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Berat Badan</p>
                    <p>: {siswa?.data?.berat_badan} kg</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Lingkar Kepala</p>
                    <p>: {siswa?.data?.lingkar_kepala} cm</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Golongan Darah</p>
                    <p>: {siswa?.data?.gol_darah}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Agama</p>
                    <p>: {siswa?.data?.agama}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Suku</p>
                    <p>: {siswa?.data?.suku}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Kewarganegaraan</p>
                    <p>: {siswa?.data?.kewarganegaraan}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Alamat Rumah</p>
                    <p>: {siswa?.data?.alamat}</p>
                    <div className="flex gap-3"></div>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Telepon Rumah</p>
                    <p>: {siswa?.data?.telp_rumah || "-"}</p>
                  </div>
                </div>
                <div className="basis-3/12 flex flex-col items-center">
                  <Image
                    src={siswa?.data?.avatar || ""}
                    width={500}
                    height={500}
                    className="w-[100px]"
                    alt="Siswa"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-500 text-center text-white">
                DATA SEKOLAH
              </div>
              <div className="flex justify-between text-xs gap-4">
                <div className="w-full space-y-1">
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Asal Sekolah</p>
                    <p>: {siswa?.data?.lulusan_dari || "-"}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Tahun Lulus</p>
                    <p>: {siswa?.data?.tahun_lulus_asal || "-"}</p>
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">NPSN</p>
                    <p>: {siswa?.data?.npsn_asal || "-"}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Alamat</p>
                    <p>: {siswa?.data?.alamat_sekolah_asal || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-500 text-center text-white">
                DATA KELUARGA
              </div>
              <div className="text-xs space-y-3">
                <div>
                  <p className="pb-4">
                    Anak ke {siswa?.data?.anak_ke} dari{" "}
                    {siswa?.data?.jumlah_saudara} bersaudara
                  </p>
                  <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                    {/* Header */}
                    <thead className="bg-gray-100">
                      <tr className="pb-2">
                        <th className="px-4 py-1 border !pb-2 text-left">
                          Nama
                        </th>
                        <th className="px-4 py-1 border !pb-2 text-left">
                          Jenis Kelamin
                        </th>
                        <th className="px-4 py-1 border !pb-2 text-left">
                          Pendidikan
                        </th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      {(siswa?.data?.keluarga?.length as number) > 0 ? (
                        siswa?.data?.keluarga
                          .filter((kel) => kel.hubungan !== "Orang Tua")
                          .map((item, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50 pb-2"
                            >
                              <td className="px-4 py-1 border pb-2">
                                {item.nama}
                              </td>
                              <td className="px-4 py-1 border pb-2">
                                {item.nama}
                              </td>
                              <td className="px-4 py-1 border pb-2">
                                {item.pendidikan}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-4 text-gray-500"
                          >
                            Tidak ada data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                  {/* Header */}
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-1 border text-left">Identitas</th>
                      <th className="px-4 py-1 border text-left">Ayah</th>
                      <th className="px-4 py-1 border text-left">Ibu</th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Nama</td>
                      <td className="px-4 py-1 border">{dataAyah?.nama}</td>
                      <td className="px-4 py-1 border">{dataIbu?.nama}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Tanggal Lahir</td>
                      <td className="px-4 py-1 border">
                        {moment(dataAyah?.tanggal_lahir).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-4 py-1 border">
                        {moment(dataIbu?.tanggal_lahir).format("DD/MM/YYYY")}
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">NIK</td>
                      <td className="px-4 py-1 border">{dataAyah?.nik}</td>
                      <td className="px-4 py-1 border">{dataIbu?.nik}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Agama</td>
                      <td className="px-4 py-1 border">{dataAyah?.agama}</td>
                      <td className="px-4 py-1 border">{dataIbu?.agama}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Suku</td>
                      <td className="px-4 py-1 border">{dataAyah?.suku}</td>
                      <td className="px-4 py-1 border">{dataIbu?.suku}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Pendidikan</td>
                      <td className="px-4 py-1 border">
                        {dataAyah?.pendidikan}
                      </td>
                      <td className="px-4 py-1 border">
                        {dataIbu?.pendidikan}
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Pekerjaan</td>
                      <td className="px-4 py-1 border">
                        {dataAyah?.pekerjaan}
                      </td>
                      <td className="px-4 py-1 border">{dataIbu?.pekerjaan}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Alamat</td>
                      <td className="px-4 py-1 border">{dataAyah?.alamat}</td>
                      <td className="px-4 py-1 border">{dataIbu?.alamat}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">
                        Penghasilan per bulan
                      </td>
                      <td className="px-4 py-1 border">{dataAyah?.gaji}</td>
                      <td className="px-4 py-1 border">{dataIbu?.gaji}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Email</td>
                      <td className="px-4 py-1 border">{dataAyah?.email}</td>
                      <td className="px-4 py-1 border">{dataIbu?.email}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">No. HP</td>
                      <td className="px-4 py-1 border">{dataAyah?.no_hp}</td>
                      <td className="px-4 py-1 border">{dataIbu?.no_hp}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            ref={pdfRef}
            className="max-w-[800px] hidden space-y-5 text-sm border bg-white shadow-lg rounded-lg aspect-[21/29.7] p-5"
          >
            <div className="space-y-3">
              <div className="bg-blue-500 text-center text-white !mt-0 pb-3">
                DATA CALON SISWA
              </div>

              <div className="flex justify-between items-center text-xs gap-4">
                <div className="basis-9/12 space-y-1">
                  <div className="flex gap-3">
                    <p className="w-[150px]">Nama Lengkap</p>
                    <p>: {siswa?.data?.nama}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Tempat Tanggal Lahir</p>
                    <p>
                      : {siswa?.data?.tempat_lahir},{" "}
                      {moment(siswa?.data?.tanggal_lahir).format("DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">NIK</p>
                    <p>: {siswa?.data?.nik}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">NIS</p>
                    <p>: {siswa?.data?.nis}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">NISN</p>
                    <p>: {siswa?.data?.nisn}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Jenis Kelamin</p>
                    <p>: {siswa?.data?.jenis_kelamin || "-"}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Tinggi Badan</p>
                    <p>: {siswa?.data?.tinggi_badan} cm</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Berat Badan</p>
                    <p>: {siswa?.data?.berat_badan} kg</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Lingkar Kepala</p>
                    <p>: {siswa?.data?.lingkar_kepala} cm</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Golongan Darah</p>
                    <p>: {siswa?.data?.gol_darah}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Agama</p>
                    <p>: {siswa?.data?.agama}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Suku</p>
                    <p>: {siswa?.data?.suku}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px]">Kewarganegaraan</p>
                    <p>: {siswa?.data?.kewarganegaraan}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Alamat Rumah</p>
                    <p>: {siswa?.data?.alamat}</p>
                    <div className="flex gap-3"></div>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Telepon Rumah</p>
                    <p>: {siswa?.data?.telp_rumah || "-"}</p>
                  </div>
                </div>
                <div className="basis-3/12 flex flex-col items-center">
                  <Image
                    src={siswa?.data?.avatar || ""}
                    width={500}
                    height={500}
                    className="w-[100px]"
                    alt="Siswa"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-500 text-center text-white pb-3">
                DATA SEKOLAH
              </div>
              <div className="flex justify-between text-xs gap-4">
                <div className="w-full space-y-1">
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Asal Sekolah</p>
                    <p>: {siswa?.data?.lulusan_dari || "-"}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Tahun Lulus</p>
                    <p>: {siswa?.data?.tahun_lulus_asal || "-"}</p>
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">NPSN</p>
                    <p>: {siswa?.data?.npsn_asal || "-"}</p>
                  </div>
                  <div className="flex gap-3">
                    <p className="w-[150px] flex-shrink-0">Alamat</p>
                    <p>: {siswa?.data?.alamat_sekolah_asal || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-500 text-center text-white pb-3">
                DATA KELUARGA
              </div>
              <div className="text-xs space-y-3">
                <div>
                  <p className="pb-4">
                    Anak ke {siswa?.data?.anak_ke} dari{" "}
                    {siswa?.data?.jumlah_saudara} bersaudara
                  </p>
                  <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                    {/* Header */}
                    <thead className="bg-gray-100">
                      <tr className="pb-2">
                        <th className="px-4 py-1 border !pb-2 text-left">
                          Nama
                        </th>
                        <th className="px-4 py-1 border !pb-2 text-left">
                          Jenis Kelamin
                        </th>
                        <th className="px-4 py-1 border !pb-2 text-left">
                          Pendidikan
                        </th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      {(siswa?.data?.keluarga?.length as number) > 0 ? (
                        siswa?.data?.keluarga
                          .filter((kel) => kel.hubungan !== "Orang Tua")
                          .map((item, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50 pb-2"
                            >
                              <td className="px-4 py-1 border pb-2">
                                {item.nama}
                              </td>
                              <td className="px-4 py-1 border pb-2">
                                {item.nama}
                              </td>
                              <td className="px-4 py-1 border pb-2">
                                {item.pendidikan}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-4 text-gray-500"
                          >
                            Tidak ada data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <table className="min-w-full border text-xs border-gray-200 rounded-lg">
                  {/* Header */}
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-1 border text-left">Identitas</th>
                      <th className="px-4 py-1 border text-left">Ayah</th>
                      <th className="px-4 py-1 border text-left">Ibu</th>
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Nama</td>
                      <td className="px-4 py-1 border">{dataAyah?.nama}</td>
                      <td className="px-4 py-1 border">{dataIbu?.nama}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Tanggal Lahir</td>
                      <td className="px-4 py-1 border">
                        {moment(dataAyah?.tanggal_lahir).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-4 py-1 border">
                        {moment(dataIbu?.tanggal_lahir).format("DD/MM/YYYY")}
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">NIK</td>
                      <td className="px-4 py-1 border">{dataAyah?.nik}</td>
                      <td className="px-4 py-1 border">{dataIbu?.nik}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Agama</td>
                      <td className="px-4 py-1 border">{dataAyah?.agama}</td>
                      <td className="px-4 py-1 border">{dataIbu?.agama}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Suku</td>
                      <td className="px-4 py-1 border">{dataAyah?.suku}</td>
                      <td className="px-4 py-1 border">{dataIbu?.suku}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Pendidikan</td>
                      <td className="px-4 py-1 border">
                        {dataAyah?.pendidikan}
                      </td>
                      <td className="px-4 py-1 border">
                        {dataIbu?.pendidikan}
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Pekerjaan</td>
                      <td className="px-4 py-1 border">
                        {dataAyah?.pekerjaan}
                      </td>
                      <td className="px-4 py-1 border">{dataIbu?.pekerjaan}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Alamat</td>
                      <td className="px-4 py-1 border">{dataAyah?.alamat}</td>
                      <td className="px-4 py-1 border">{dataIbu?.alamat}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">
                        Penghasilan per bulan
                      </td>
                      <td className="px-4 py-1 border">{dataAyah?.gaji}</td>
                      <td className="px-4 py-1 border">{dataIbu?.gaji}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">Email</td>
                      <td className="px-4 py-1 border">{dataAyah?.email}</td>
                      <td className="px-4 py-1 border">{dataIbu?.email}</td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-4 py-1 border">No. HP</td>
                      <td className="px-4 py-1 border">{dataAyah?.no_hp}</td>
                      <td className="px-4 py-1 border">{dataIbu?.no_hp}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SiswaDetail;
