/**
 * Utility functions for handling emoji validation and removal
 */

// Regex untuk mendeteksi emoji dan karakter unicode khusus
export const emojiRegex =
  /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]|[\uD83E][\uDD00-\uDDFF]|[\u2000-\u206F]|[\u2E00-\u2E7F]|[\u3000-\u303F]|[\uFE00-\uFE0F]|[\u200D]|[\u20D0-\u20FF]|[\uFE0E\uFE0F]/g;

/**
 * Check if text contains emoji
 * @param text - Text to check
 * @returns boolean - true if contains emoji
 */
export const containsEmoji = (text: string): boolean => {
  return emojiRegex.test(text);
};

/**
 * Remove all emojis from text
 * @param text - Text to clean
 * @returns string - Text without emojis
 */
export const removeEmojis = (text: string): string => {
  return text.replace(emojiRegex, "");
};

/**
 * Validate and clean input text from emojis
 * @param value - Input value
 * @param fieldName - Name of the field for error message
 * @returns object with isValid boolean and cleanedValue string
 */
export const validateAndCleanInput = (value: string, fieldName?: string) => {
  const hasEmoji = containsEmoji(value);
  const cleanedValue = removeEmojis(value);

  return {
    isValid: !hasEmoji,
    cleanedValue,
    errorMessage: hasEmoji
      ? `${fieldName || "Field"} tidak boleh mengandung emoji`
      : null,
  };
};

/**
 * Higher-order function to create onChange handler that prevents emoji input
 * @param originalOnChange - Original onChange function
 * @param options - Options for emoji handling
 * @returns Modified onChange function
 */
export const createEmojiSafeOnChange = (
  originalOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  options: {
    showWarning?: boolean;
    fieldName?: string;
    autoClean?: boolean;
  } = {}
) => {
  const { showWarning = true, fieldName = "Input", autoClean = true } = options;

  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const validation = validateAndCleanInput(value, fieldName);

    if (!validation.isValid) {
      if (showWarning) {
        // You can replace this with your preferred toast/notification system
        console.warn(validation.errorMessage);
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
};

/**
 * Higher-order function for handling paste events to prevent emoji pasting
 * @param originalOnPaste - Original onPaste function (optional)
 * @param options - Options for emoji handling
 * @returns onPaste handler
 */
export const createEmojiSafePaste = (
  originalOnPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void,
  options: {
    showWarning?: boolean;
    fieldName?: string;
    autoClean?: boolean;
  } = {}
) => {
  const { showWarning = true, fieldName = "Input", autoClean = true } = options;

  return (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    const validation = validateAndCleanInput(pastedText, fieldName);

    if (!validation.isValid) {
      if (showWarning) {
        console.warn(validation.errorMessage);
      }

      if (autoClean) {
        // Prevent default paste and manually set cleaned value
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        const currentValue = target.value;
        const newValue =
          currentValue.slice(0, start) +
          validation.cleanedValue +
          currentValue.slice(end);

        // Update the input value
        target.value = newValue;

        // Trigger change event
        const changeEvent = new Event("change", { bubbles: true });
        target.dispatchEvent(changeEvent);

        return;
      }

      // Prevent paste if not auto-cleaning
      e.preventDefault();
      return;
    }

    // Call original onPaste if provided and no emoji detected
    if (originalOnPaste) {
      originalOnPaste(e);
    }
  };
};
