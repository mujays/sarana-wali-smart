import { useCallback } from "react";
import { toast } from "sonner";
import { validateAndCleanInput, containsEmoji } from "@/lib/emoji-utils";

interface UseEmojiValidationOptions {
  showToast?: boolean;
  autoClean?: boolean;
  fieldName?: string;
}

export const useEmojiValidation = (options: UseEmojiValidationOptions = {}) => {
  const { showToast = true, autoClean = true, fieldName = "Field" } = options;

  // Handler untuk input biasa
  const handleInputChange = useCallback(
    (originalOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const validation = validateAndCleanInput(value, fieldName);

        if (!validation.isValid) {
          if (showToast) {
            toast.error(`${fieldName} tidak boleh mengandung emoji`);
          }

          if (autoClean) {
            // Create new event with cleaned value
            const newEvent = {
              ...e,
              target: {
                ...e.target,
                value: validation.cleanedValue,
              },
            };
            originalOnChange(newEvent as React.ChangeEvent<HTMLInputElement>);
            return;
          }

          // Prevent the change if not auto-cleaning
          return;
        }

        // Call original onChange if no emoji detected
        originalOnChange(e);
      };
    },
    [showToast, autoClean, fieldName]
  );

  // Handler untuk textarea
  const handleTextAreaChange = useCallback(
    (originalOnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void) => {
      return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        const validation = validateAndCleanInput(value, fieldName);

        if (!validation.isValid) {
          if (showToast) {
            toast.error(`${fieldName} tidak boleh mengandung emoji`);
          }

          if (autoClean) {
            // Create new event with cleaned value
            const newEvent = {
              ...e,
              target: {
                ...e.target,
                value: validation.cleanedValue,
              },
            };
            originalOnChange(
              newEvent as React.ChangeEvent<HTMLTextAreaElement>
            );
            return;
          }

          // Prevent the change if not auto-cleaning
          return;
        }

        // Call original onChange if no emoji detected
        originalOnChange(e);
      };
    },
    [showToast, autoClean, fieldName]
  );

  // Handler untuk paste events
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const pastedText = e.clipboardData.getData("text");

      if (containsEmoji(pastedText)) {
        if (showToast) {
          toast.error(`${fieldName} tidak boleh mengandung emoji`);
        }

        if (autoClean) {
          e.preventDefault();
          const target = e.target as HTMLInputElement | HTMLTextAreaElement;
          const start = target.selectionStart || 0;
          const end = target.selectionEnd || 0;
          const currentValue = target.value;
          const cleanedPastedText =
            validateAndCleanInput(pastedText).cleanedValue;
          const newValue =
            currentValue.slice(0, start) +
            cleanedPastedText +
            currentValue.slice(end);

          // Update the input value
          target.value = newValue;

          // Set cursor position
          const newPosition = start + cleanedPastedText.length;
          target.setSelectionRange(newPosition, newPosition);

          // Trigger change event
          const changeEvent = new Event("input", { bubbles: true });
          target.dispatchEvent(changeEvent);

          return;
        }

        // Prevent paste if not auto-cleaning
        e.preventDefault();
        return;
      }
    },
    [showToast, autoClean, fieldName]
  );

  // Function to validate existing value
  const validateValue = useCallback(
    (value: string) => {
      return validateAndCleanInput(value, fieldName);
    },
    [fieldName]
  );

  return {
    handleInputChange,
    handleTextAreaChange,
    handlePaste,
    validateValue,
    containsEmoji,
  };
};
