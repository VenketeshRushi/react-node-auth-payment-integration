import toast from "react-hot-toast";
import type { ToastOptions } from "react-hot-toast";

const getDefaultConfig = (): ToastOptions => {
	return {
		position: "top-center",
		duration: 4000,
		style: {
			background: "var(--background)",
			color: "var(--foreground)",
			borderRadius: "8px",
			padding: "12px 16px",
			border: "1px solid var(--border)",
			fontSize: "14px",
		},
	};
};

export const useToast = () => {
	return {
		success: (message: string, options: ToastOptions = {}) =>
			toast.success(message, { ...getDefaultConfig(), ...options }),

		error: (message: string, options: ToastOptions = {}) =>
			toast.error(message, { ...getDefaultConfig(), ...options }),

		loading: (message: string, options: ToastOptions = {}) =>
			toast.loading(message, { ...getDefaultConfig(), ...options }),

		custom: (message: string, options: ToastOptions = {}) =>
			toast(message, { ...getDefaultConfig(), ...options }),

		dismiss: (id?: string) => toast.dismiss(id),
	};
};
