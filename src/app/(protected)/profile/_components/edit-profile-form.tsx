/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AuthService from "@/services/auth/auth.service";
import { toast } from "sonner";
import errorResponse from "@/lib/error";
import { AxiosError } from "axios";
import { useEmojiValidation } from "@/hooks/use-emoji-validation";
import { containsEmoji, removeEmojis } from "@/lib/emoji-utils";

interface EditProfileFormProps {
  initialData?: {
    nama?: string;
    no_hp?: string;
    pekerjaan?: string;
  };
}

interface FormData {
  nama: string;
  no_hp: string;
  pekerjaan: string;
}

interface FormErrors {
  nama: string;
  no_hp: string;
  pekerjaan: string;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData,
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { handlePaste } = useEmojiValidation({
    fieldName: "Input",
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    no_hp: "",
    pekerjaan: "",
  });

  // Form errors
  const [errors, setErrors] = useState<FormErrors>({
    nama: "",
    no_hp: "",
    pekerjaan: "",
  });

  // Touched fields (untuk menampilkan error hanya setelah user menyentuh field)
  const [touched, setTouched] = useState({
    nama: false,
    no_hp: false,
    pekerjaan: false,
  });

  // Set initial form values when initialData changes
  useEffect(() => {
    if (initialData) {
      // Extract phone number without +62 prefix for display
      let phoneNumber = initialData.no_hp || "";
      if (phoneNumber.startsWith("+62")) {
        phoneNumber = phoneNumber.substring(3);
      } else if (phoneNumber.startsWith("62")) {
        phoneNumber = phoneNumber.substring(2);
      }

      setFormData({
        nama: initialData.nama || "",
        no_hp: phoneNumber,
        pekerjaan: initialData.pekerjaan || "",
      });
    }
  }, [initialData]);

  // Validation functions
  const validateNama = (value: string): string => {
    if (!value.trim()) {
      return "Nama harus diisi";
    }
    if (value.length < 2) {
      return "Nama minimal 2 karakter";
    }
    if (value.length > 100) {
      return "Nama maksimal 100 karakter";
    }
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return "Nama hanya boleh berisi huruf dan spasi";
    }
    return "";
  };

  const validateNoHp = (value: string): string => {
    if (!value.trim()) {
      return "Nomor HP harus diisi";
    }

    // Remove +62 prefix if exists for validation
    let phoneNumber = value;
    if (phoneNumber.startsWith("+62")) {
      phoneNumber = phoneNumber.substring(3);
    } else if (phoneNumber.startsWith("62")) {
      phoneNumber = phoneNumber.substring(2);
    }

    // Check if it's all digits
    if (!/^\d+$/.test(phoneNumber)) {
      return "Nomor HP hanya boleh berisi angka";
    }

    if (phoneNumber.length < 8) {
      return "Nomor HP minimal 8 digit";
    }

    if (phoneNumber.length > 12) {
      return "Nomor HP maksimal 12 digit";
    }

    return "";
  };

  const validatePekerjaan = (value: string): string => {
    if (value.length > 50) {
      return "Pekerjaan maksimal 50 karakter";
    }
    return "";
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      nama: validateNama(formData.nama),
      no_hp: validateNoHp(formData.no_hp),
      pekerjaan: validatePekerjaan(formData.pekerjaan),
    };

    setErrors(newErrors);
    setTouched({
      nama: true,
      no_hp: true,
      pekerjaan: true,
    });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Ensure phone number has +62 prefix
      const payload = {
        ...formData,
        pekerjaan: formData.pekerjaan || undefined, // Set to null if empty
        no_hp: formData.no_hp.startsWith("+62")
          ? formData.no_hp
          : `+62${formData.no_hp}`,
      };

      await AuthService.updatePassword(payload); // Using existing API endpoint

      toast.success("Profile berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["ME"] });
    } catch (error) {
      toast.error("Gagal memperbarui profile");
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  }; // Input change handlers
  const handleInputChange = (field: keyof FormData, value: string) => {
    // Check if value contains emojis and clean if needed
    let cleanedValue = value;
    if (containsEmoji(value)) {
      cleanedValue = removeEmojis(value);
      toast.error(`${field} tidak boleh mengandung emoji`);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: cleanedValue,
    }));

    // Validate field on change if already touched
    if (touched[field]) {
      let error = "";
      switch (field) {
        case "nama":
          error = validateNama(cleanedValue);
          break;
        case "no_hp":
          error = validateNoHp(cleanedValue);
          break;
        case "pekerjaan":
          error = validatePekerjaan(cleanedValue);
          break;
      }
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate on blur
    let error = "";
    switch (field) {
      case "nama":
        error = validateNama(formData[field]);
        break;
      case "no_hp":
        error = validateNoHp(formData[field]);
        break;
      case "pekerjaan":
        error = validatePekerjaan(formData[field]);
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // Handle phone number input - only allow numbers
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove any non-digit characters except +
    value = value.replace(/[^\d+]/g, "");

    // If user types +62, remove it (we'll add it automatically)
    if (value.startsWith("+62")) {
      value = value.substring(3);
    } else if (value.startsWith("62")) {
      value = value.substring(2);
    }

    // Remove + sign if it's not at the beginning
    if (value.includes("+")) {
      value = value.replace(/\+/g, "");
    }

    // Limit length to 12 digits
    if (value.length > 12) {
      value = value.substring(0, 12);
    }

    handleInputChange("no_hp", value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Edit Profile</h3>

      <form onSubmit={onSubmit} autoComplete="off">
        <div className="space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="Masukkan nama lengkap"
                maxLength={100}
                value={formData.nama}
                onChange={(e) => handleInputChange("nama", e.target.value)}
                onBlur={() => handleBlur("nama")}
                onPaste={handlePaste}
                status={touched.nama && errors.nama ? "error" : ""}
              />
              {touched.nama && errors.nama && (
                <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
              )}
            </div>

            {/* Nomor HP */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <Input
                size="large"
                placeholder="817222333"
                maxLength={12}
                value={formData.no_hp}
                onChange={handlePhoneNumberChange}
                onBlur={() => handleBlur("no_hp")}
                onPaste={handlePaste}
                addonBefore="+62"
                status={touched.no_hp && errors.no_hp ? "error" : ""}
              />
              {touched.no_hp && errors.no_hp && (
                <p className="text-red-500 text-xs mt-1">{errors.no_hp}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: 817xxxxxxx (tanpa +62)
              </p>
            </div>
          </div>

          {/* Pekerjaan */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Pekerjaan
            </label>
            <Input
              size="large"
              placeholder="Masukkan pekerjaan (opsional)"
              maxLength={50}
              value={formData.pekerjaan}
              onChange={(e) => handleInputChange("pekerjaan", e.target.value)}
              onBlur={() => handleBlur("pekerjaan")}
              onPaste={handlePaste}
              status={touched.pekerjaan && errors.pekerjaan ? "error" : ""}
            />
            {touched.pekerjaan && errors.pekerjaan && (
              <p className="text-red-500 text-xs mt-1">{errors.pekerjaan}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="min-w-[150px]"
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
