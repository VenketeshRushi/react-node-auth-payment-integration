import { useContext } from "react";
import type { ThemeProviderContextType } from "@/types/theme";
import { ThemeProviderContext } from "@/providers/ThemeContext";

export const useTheme = (): ThemeProviderContextType => {
	const context = useContext(ThemeProviderContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};
