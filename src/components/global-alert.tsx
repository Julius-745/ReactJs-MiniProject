import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { type AlertVariantType, alertConfig } from "./alert-variant";
import { alertEmitter } from "../lib/alert";

export function GlobalAlert() {
  const [alert, setAlert] = useState<{
    variant: AlertVariantType;
    message: string;
    title?: string;
  } | null>(null);

  useEffect(() => {
    alertEmitter.subscribe((payload) => setAlert(payload));
    return () => alertEmitter.unsubscribe();
  }, []);

  if (!alert) return null;

  const config = alertConfig[alert.variant];

  return (
    <Alert
      variant={config.shadcnVariant}
      className={`max-w-md relative ${config.className}`}
    >
      {config.icon}
      <AlertTitle>{alert.title ?? config.defaultTitle}</AlertTitle>
      <AlertDescription>{alert.message}</AlertDescription>
      <button
        onClick={() => setAlert(null)}
        className="absolute top-3 right-3 opacity-60 hover:opacity-100 transition-opacity"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </Alert>
  );
}