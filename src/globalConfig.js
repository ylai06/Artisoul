/**
 * Global Configuration
 */
export const globalConfig = {
  // Initial theme (if localStorage is not set)
  initTheme: {
    // Initially set to light theme
    dark: false,
    // Initial theme color
    // Corresponds to a value in the customColorPrimarys array
    // null means using the Ant Design default theme color or the first theme color scheme of
    // customColorPrimarys by default
    colorPrimary: null,
  },
  // Theme color for users to choose. If this function is not provided, set it to an empty array.
  customColorPrimarys: [
    "#1677ff",
    "#f5222d",
    "#fa8c16",
    "#722ed1",
    "#13c2c2",
    "#52c41a",
  ],
  // localStroge user theme information identifier
  SESSION_LOGIN_THEME: "userTheme",
  // localStroge user login information identifier
  SESSION_LOGIN_INFO: "userLoginInfo",
};
