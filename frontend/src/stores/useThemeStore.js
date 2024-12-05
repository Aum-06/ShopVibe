import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDarkMode: false, // Default to light mode
  toggleDarkMode: () => {
    set((state) => {
      const newDarkModeState = !state.isDarkMode;
      if (newDarkModeState) {
        document.documentElement.classList.add('dark'); 
      } else {
        document.documentElement.classList.remove('dark'); 
      }
      return { isDarkMode: newDarkModeState };
    });
  },
}));

export default useThemeStore;
