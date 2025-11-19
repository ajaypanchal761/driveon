import { createSlice } from '@reduxjs/toolkit';

/**
 * Theme Slice
 * Manages theme preferences (can be used alongside Theme Context)
 */
const initialState = {
  themePreference: localStorage.getItem('themePreference') || 'custom',
  systemTheme: 'light', // Detected system theme
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemePreference: (state, action) => {
      state.themePreference = action.payload;
      localStorage.setItem('themePreference', action.payload);
    },
    setSystemTheme: (state, action) => {
      state.systemTheme = action.payload;
    },
  },
});

export const { setThemePreference, setSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;

