/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatFileSize } from "@/lib/utils";
import { FileIcon, Trash2Icon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Image as ImageAntd, Progress } from "antd";
import axiosConfig from "@/configs/axios";
import Image from "next/image";

type Props = {
  file?: File | string;
  onSuccess: (url: string) => void;
  onDelete?: () => void;
  url: string;
};

function FileItem({ file, onSuccess, onDelete, url }: Props) {
  const [progressValue, setProgressValue] = useState(0);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append("upload", file);

      const res = await axiosConfig.post("/upload", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent && progressEvent.total) {
            const value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgressValue((prev) =>
              value === 100 ? 99 : value > prev ? value : prev
            );
          }
        },
      });
      setProgressValue(100);

      setTimeout(() => {
        onSuccess(res.data?.data);
      }, 1000);
    } catch (error: any) {
      toast.error(error?.message || "Ada kesalahan ketika upload!");
    }
  };

  useEffect(() => {
    if (file && file instanceof File) {
      handleUpload(file);
    }
  }, []);

  if (typeof file === "string") {
    return (
      <div className="border rounded w-fit relative">
        <XIcon
          className="z-10 absolute -right-2 -top-2 text-white bg-black/45 rounded-full flex-shrink-0"
          onClick={() => onDelete?.()}
        />
        <ImageAntd src={file} alt="Berkas" className="w-" />
      </div>
    );
  }

  if (file instanceof File) {
    return (
      <div className="p-3 border border-gray-300 rounded-lg flex flex-col sm:flex-row gap-4 items-start">
        <div className="bg-white self-center flex-shrink-0">
          {file?.type.startsWith("image/") ? (
            <Image
              src={url}
              alt="Berkas"
              width={500}
              height={500}
              className="w-32 sm:w-20 rounded"
            />
          ) : (
            <div className="p-3">
              <FileIcon className="w-8 h-8 text-primary" />
              <p className="text-xs text-center text-primary">PDF</p>
            </div>
          )}
        </div>
        <div className="w-full space-y-1 overflow-hidden">
          <div className="flex justify-between">
            <div className="overflow-hidden">
              <p className="truncate">{file?.name}</p>
              <p className="font-light text-gray-500">
                {formatFileSize(file?.size as number)}
              </p>
            </div>
            <Trash2Icon
              className="cursor-pointer text-red-500 flex-shrink-0"
              onClick={() => onDelete?.()}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2">
              <Progress percent={progressValue} />
              <p className="text-right text-gray-500">{progressValue}%</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default FileItem;
