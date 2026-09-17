import { useCallback, useRef, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
  tone: "success" | "info";
}

const AUTO_DISMISS_MS = 2600;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (text: string, tone: ToastMessage["tone"] = "success") => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, text, tone }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}
