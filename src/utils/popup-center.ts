/**
 * Opens a popup window centered on the screen
 * @param url - The URL to open in the popup
 * @param title - The title of the popup window
 * @param width - Width of the popup window
 * @param height - Height of the popup window
 * @returns The popup window reference
 */
export const popupCenter = (
  url: string,
  title: string,
  width: number,
  height: number,
): Window | null => {
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  return window.open(
    url,
    title,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`,
  );
};
