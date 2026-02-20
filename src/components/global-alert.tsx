import { useEffect, useState, useRef } from 'react';
import { XIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { type AlertVariantType, alertConfig } from './alert-variant';
import { alertEmitter } from '../lib/alert';

const DEFAULT_TIMEOUT = 3000; // 3 seconds

export function GlobalAlert() {
  const [alert, setAlert] = useState<{
    variant: AlertVariantType;
    message: string;
    title?: string;
    duration?: number; // optional custom duration
  } | null>(null);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    alertEmitter.subscribe((payload) => {
      setAlert(payload);
    });

    return () => {
      alertEmitter.unsubscribe();
    };
  }, []);

  // Auto dismiss logic
  useEffect(() => {
    if (!alert) return;

    // clear previous timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setAlert(null);
    }, alert.duration ?? DEFAULT_TIMEOUT);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [alert]);

  if (!alert) return null;

  const config = alertConfig[alert.variant];

  return (
    <Alert
      variant={config.shadcnVariant}
      className={`relative min-w-sm ${config.className}`}
    >
      {config.icon}
      <AlertTitle className="text-start">
        {alert.title ?? config.defaultTitle}
      </AlertTitle>
      <AlertDescription className="text-bold">{alert.message}</AlertDescription>

      <button
        onClick={() => setAlert(null)}
        className="absolute top-3 right-3 opacity-60 transition-opacity hover:opacity-100"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </Alert>
  );
}
