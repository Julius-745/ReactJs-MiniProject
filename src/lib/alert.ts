import type { AlertVariantType } from "../components/alert-variant";

interface AlertPayload {
  variant: AlertVariantType;
  message: string;
  title?: string;
}

type AlertListener = (payload: AlertPayload) => void;

let listener: AlertListener | null = null;

export const alertEmitter = {
  subscribe: (fn: AlertListener) => {
    listener = fn;
  },
  unsubscribe: () => {
    listener = null;
  },
};

export const showAlert = (
  variant: AlertVariantType,
  message: string,
  title?: string
) => {
  listener?.({ variant, message, title });
};