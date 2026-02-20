import type { AppAlertProps } from "./alert-variant";
import { alertConfig } from "./alert-variant";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export function AlertDialog({ variant, title, message, className = "" }: AppAlertProps) {
  const config = alertConfig[variant];

  return (
    <Alert
      variant={config.shadcnVariant}
      className={`max-w-md ${config.className} ${className}`}
    >
      {config.icon}
      <AlertTitle>{title ?? config.defaultTitle}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}