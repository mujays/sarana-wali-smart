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

export function numberToWordsID(nominal: number): string {
  const satuan = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ];

  function terbilang(n: number): string {
    if (n < 12) {
      return satuan[n];
    } else if (n < 20) {
      return `${satuan[n - 10]} belas`;
    } else if (n < 100) {
      const puluhan = Math.floor(n / 10);
      const sisa = n % 10;
      return `${satuan[puluhan]} puluh${sisa ? " " + satuan[sisa] : ""}`;
    } else if (n < 200) {
      return `seratus${n - 100 ? " " + terbilang(n - 100) : ""}`;
    } else if (n < 1000) {
      const ratusan = Math.floor(n / 100);
      const sisa = n % 100;
      return `${satuan[ratusan]} ratus${sisa ? " " + terbilang(sisa) : ""}`;
    } else if (n < 2000) {
      return `seribu${n - 1000 ? " " + terbilang(n - 1000) : ""}`;
    } else if (n < 1000000) {
      const ribuan = Math.floor(n / 1000);
      const sisa = n % 1000;
      return `${terbilang(ribuan)} ribu${sisa ? " " + terbilang(sisa) : ""}`;
    } else if (n < 1000000000) {
      const jutaan = Math.floor(n / 1000000);
      const sisa = n % 1000000;
      return `${terbilang(jutaan)} juta${sisa ? " " + terbilang(sisa) : ""}`;
    } else if (n < 1000000000000) {
      const milyaran = Math.floor(n / 1000000000);
      const sisa = n % 1000000000;
      return `${terbilang(milyaran)} miliar${
        sisa ? " " + terbilang(sisa) : ""
      }`;
    } else {
      return "nominal terlalu besar";
    }
  }

  const hasil = terbilang(nominal).trim();
  return hasil ? hasil + " rupiah" : "";
}

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
