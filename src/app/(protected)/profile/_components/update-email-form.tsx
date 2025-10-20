/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Input, Alert } from "antd";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AuthService from "@/services/auth/auth.service";
import { toast } from "sonner";
import errorResponse from "@/lib/error";
import { AxiosError } from "axios";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";
import { useEmojiValidation } from "@/hooks/use-emoji-validation";
import { containsEmoji, removeEmojis } from "@/lib/emoji-utils";

interface UpdateEmailFormProps {
  currentEmail?: string;
}

interface EmailFormData {
  newEmail: string;
  password: string;
  captcha: string;
}

interface EmailFormErrors {
  newEmail: string;
  password: string;
  captcha: string;
}

export const UpdateEmailForm: React.FC<UpdateEmailFormProps> = ({
  currentEmail,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { handlePaste } = useEmojiValidation({
    fieldName: "Input",
  });

  // Form state
  const [formData, setFormData] = useState<EmailFormData>({
    newEmail: "",
    password: "",
    captcha: "",
  });

  // Form errors
  const [errors, setErrors] = useState<EmailFormErrors>({
    newEmail: "",
    password: "",
    captcha: "",
  });

  // Touched fields
  const [touched, setTouched] = useState({
    newEmail: false,
    password: false,
    captcha: false,
  });

  // Captcha state
  const [captchaText, setCaptchaText] = useState("");

  // Generate random captcha
  const generateCaptcha = (): string => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Draw captcha on canvas
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.3)`;
      ctx.lineWidth = Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw each character with random color and slight rotation
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(
        Math.random() * 100
      )}, ${Math.floor(Math.random() * 100)})`;
      const x = 30 + i * 25;
      const y = canvas.height / 2;
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }

    // Add noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  // Initialize captcha
  useEffect(() => {
    const newCaptcha = generateCaptcha();
    setCaptchaText(newCaptcha);
    setTimeout(() => drawCaptcha(newCaptcha), 100);
  }, []);

  // Refresh captcha
  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptchaText(newCaptcha);
    drawCaptcha(newCaptcha);
    handleInputChange("captcha", "");
    setErrors((prev) => ({ ...prev, captcha: "" }));
  };

  // Validation functions
  const validateNewEmail = (value: string): string => {
    if (!value.trim()) {
      return "Email baru harus diisi";
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      return "Format email tidak valid";
    }
    if (value === currentEmail) {
      return "Email baru tidak boleh sama dengan email saat ini";
    }
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value.trim()) {
      return "Password harus diisi";
    }
    if (value.length < 6) {
      return "Password minimal 6 karakter";
    }
    return "";
  };

  const validateCaptcha = (value: string): string => {
    if (!value.trim()) {
      return "Captcha harus diisi";
    }
    if (value !== captchaText) {
      return "Captcha tidak sesuai";
    }
    return "";
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = {
      newEmail: validateNewEmail(formData.newEmail),
      password: validatePassword(formData.password),
      captcha: validateCaptcha(formData.captcha),
    };

    setErrors(newErrors);
    setTouched({
      newEmail: true,
      password: true,
      captcha: true,
    });

    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Input change handlers
  const handleInputChange = (field: keyof EmailFormData, value: string) => {
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
        case "newEmail":
          error = validateNewEmail(cleanedValue);
          break;
        case "password":
          error = validatePassword(cleanedValue);
          break;
        case "captcha":
          error = validateCaptcha(cleanedValue);
          break;
      }
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: keyof EmailFormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate on blur
    let error = "";
    switch (field) {
      case "newEmail":
        error = validateNewEmail(formData[field]);
        break;
      case "password":
        error = validatePassword(formData[field]);
        break;
      case "captcha":
        error = validateCaptcha(formData[field]);
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Payload untuk update email
      const payload = {
        email: formData.newEmail,
        password: formData.password,
        captcha: formData.captcha,
      };

      // Menggunakan endpoint yang sama, tapi bisa dibuat endpoint khusus untuk email
      await AuthService.updatePassword(payload);

      toast.success("Email berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["ME"] });

      // Reset form
      setFormData({
        newEmail: "",
        password: "",
        captcha: "",
      });
      setTouched({
        newEmail: false,
        password: false,
        captcha: false,
      });
      setErrors({
        newEmail: "",
        password: "",
        captcha: "",
      });

      // Generate new captcha
      refreshCaptcha();
    } catch (error) {
      toast.error("Gagal memperbarui email");
      errorResponse(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Update Email</h3>
        <div className="text-sm text-gray-500">
          Email saat ini: <span className="font-medium">{currentEmail}</span>
        </div>
      </div>

      <Alert
        type="warning"
        showIcon
        message="Perhatian"
        description="Pastikan email baru dapat diakses. Anda mungkin perlu verifikasi ulang setelah mengubah email."
        className="mb-4"
      />

      <form onSubmit={onSubmit} autoComplete="off">
        <div className="space-y-4">
          {/* Email Baru */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Email Baru <span className="text-red-500">*</span>
            </label>
            <Input
              size="large"
              type="email"
              placeholder="Masukkan email baru"
              value={formData.newEmail}
              onChange={(e) => handleInputChange("newEmail", e.target.value)}
              onBlur={() => handleBlur("newEmail")}
              onPaste={handlePaste}
              status={touched.newEmail && errors.newEmail ? "error" : ""}
            />
            {touched.newEmail && errors.newEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.newEmail}</p>
            )}
          </div>

          {/* Password Konfirmasi */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Password Saat Ini <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                size="large"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password saat ini"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                onPaste={handlePaste}
                status={touched.password && errors.password ? "error" : ""}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
              />
            </div>
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500">
              Konfirmasi dengan password saat ini untuk keamanan
            </p>
          </div>

          {/* Captcha */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Captcha <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 items-start">
              <div className="flex flex-col space-y-2">
                <div className="border border-gray-300 rounded-md p-2 bg-gray-50">
                  <canvas
                    ref={canvasRef}
                    width={180}
                    height={60}
                    className="block"
                  />
                </div>
                <Button
                  type="default"
                  size="small"
                  icon={<RefreshCcw className="w-3 h-3" />}
                  onClick={refreshCaptcha}
                  className="text-xs"
                >
                  Refresh
                </Button>
              </div>
              <div className="flex-1">
                <Input
                  size="large"
                  placeholder="Masukkan captcha"
                  value={formData.captcha}
                  onChange={(e) => handleInputChange("captcha", e.target.value)}
                  onBlur={() => handleBlur("captcha")}
                  onPaste={handlePaste}
                  status={touched.captcha && errors.captcha ? "error" : ""}
                  maxLength={6}
                />
                {touched.captcha && errors.captcha && (
                  <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="min-w-[150px] bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600"
          >
            Update Email
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmailForm;
