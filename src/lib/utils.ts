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
