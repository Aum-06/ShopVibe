import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: false, // Default to light mode
  toggleDarkMode: () => {
    set((state) => {
      const newDarkModeState = !state.isDarkMode;
      // Apply/remove the 'dark' class to <html> element
      if (newDarkModeState) {
        document.documentElement.classList.add('dark'); // Enables dark mode
      } else {
        document.documentElement.classList.remove('dark'); // Disables dark mode
      }
      return { isDarkMode: newDarkModeState };
    });
  },
}));

export default useThemeStore;
