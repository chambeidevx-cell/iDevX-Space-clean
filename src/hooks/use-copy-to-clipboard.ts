import { useCallback, useEffect, useRef, useState } from 'react';

/** How long the "copied" confirmation stays visible, in milliseconds. */
const COPIED_FEEDBACK_MS = 1500;

interface UseCopyToClipboardResult {
  hasCopied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Copies text to the clipboard and flags `hasCopied` briefly so the caller can
 * swap in a confirmation icon. The timer is cleared on unmount.
 *
 * @example const { hasCopied, copy } = useCopyToClipboard();
 */
export const useCopyToClipboard = (): UseCopyToClipboardResult => {
  const [hasCopied, setHasCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const copy = useCallback(async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setHasCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHasCopied(false), COPIED_FEEDBACK_MS);
  }, []);

  return { hasCopied, copy };
};
