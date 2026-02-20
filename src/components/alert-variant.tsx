import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon } from "lucide-react";

export type AlertVariantType = "error" | "warning" | "success" | "info";

export interface AppAlertProps {
  variant: AlertVariantType;
  title?: string;
  message: string;
  className?: string;
}

export const alertConfig: Record<
  AlertVariantType,
  {
    icon: React.ReactNode;
    shadcnVariant: "default" | "destructive";
    defaultTitle: string;
    className: string;
  }
> = {
  error: {
    icon: <AlertCircleIcon />,
    shadcnVariant: "destructive",
    defaultTitle: "Error",
    className: "",
  },
  warning: {
    icon: <AlertTriangleIcon />,
    shadcnVariant: "default",
    defaultTitle: "Warning",
    className:
      "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600",
  },
  success: {
    icon: <CheckCircleIcon />,
    shadcnVariant: "default",
    defaultTitle: "Success",
    className:
      "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
  },
  info: {
    icon: <InfoIcon />,
    shadcnVariant: "default",
    defaultTitle: "Info",
    className:
      "border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600",
  },
};