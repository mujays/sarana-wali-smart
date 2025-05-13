import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const validateImage = ({
  img,
  extPermissions,
  maxSize,
}: {
  img: File;
  extPermissions: string[];
  maxSize: number;
}) => {
  if (img) {
    if (!extPermissions.includes(img.type)) {
      throw new Error("Gambar tidak valid");
    }
    if (img.size >= maxSize) {
      throw new Error("Ukuran gambar minimal 5MB");
    }
    return img;
  }
};

export const validateFile = (
  file: File,
  acceptFiles: string[],
  maxSize = 25
) => {
  if (!acceptFiles.includes(file.type)) {
    throw new Error("file tidak didukung");
  }
  const isValidSize = file.size / 1024 / 1024 < maxSize;
  if (!isValidSize) {
    throw new Error(`File maksimal ${maxSize}MB`);
  }
  return true;
};

export const formatFileSize = (sizeInBytes: number) => {
  const KB = 1024;
  const MB = KB * 1024;

  if (sizeInBytes < MB) {
    return `${(sizeInBytes / KB).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / MB).toFixed(2)} MB`;
  }
};
