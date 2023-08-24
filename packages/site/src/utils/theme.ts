/**
 * Get the user's preferred theme in local storage.
 * Will default to the browser's preferred theme if there is no value in local storage.
 *
 * @returns True if the theme is "dark" otherwise, false.
 */
export const getThemePreference = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const darkModeSystem = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  const preference = darkModeSystem ? 'dark' : 'light';

  return preference === 'dark';
};
