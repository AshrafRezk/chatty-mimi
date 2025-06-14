
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function useToast() {
  return {
    toast: ({ title, description, action, variant }: ToastProps) => {
      return sonnerToast(title, {
        description,
        action,
        // Map variant to sonner's style
        className: variant === "destructive" ? "destructive" : undefined,
      });
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
    // Empty array to match the old API signature
    toasts: [],
  };
}

// Export sonnerToast directly for simpler usage
export const toast = sonnerToast;
