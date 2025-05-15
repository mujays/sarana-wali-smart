/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn, validateFile } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";
import { ChangeEvent, DragEvent } from "react";
import { toast } from "sonner";

type Props = {
  onUpload: (files: File | null) => void;
  description: string;
  type?: "transparent" | "filled";
  id?: string;
  accept?: string;
  mimeType?: string[];
};

function Dropfile({
  onUpload,
  description,
  type = "filled",
  id = "fileInput",
  accept = ".pdf,.jpg,.jpeg,.png",
  mimeType = ["image/jpeg", "image/png", "image/jpeg"],
}: Props) {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      onUpload(file);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        validateFile(file, mimeType, 10);
        onUpload(file);
      }

      event.target.value = null as any;
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-200 transition",
        type === "filled" && "bg-gray-100"
      )}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="!hidden"
        id={id}
      />
      <label htmlFor={id} className="flex flex-col items-center cursor-pointer">
        {type === "filled" && (
          <CloudUploadIcon className="text-blue-500 w-10 h-10" />
        )}
        {type === "transparent" && (
          <div className="p-2 rounded-lg border border-gray-300">
            <CloudUploadIcon className="w-5 h-5" />
          </div>
        )}
        {type === "filled" && (
          <p className="text-gray-700 font-semibold">Drop file</p>
        )}
        {type === "transparent" && (
          <p className="text-gray-500 py-2 text-sm">
            <span className="text-blue-500 font-semibold">
              Klik untuk upload atau
            </span>{" "}
            drag & drop
          </p>
        )}
        <p className="text-gray-500 text-sm">{description} (Maksimal 10MB)</p>
        {type === "filled" && (
          <label
            htmlFor="fileInput"
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Browse Files
          </label>
        )}
      </label>
    </div>
  );
}

export default Dropfile;
