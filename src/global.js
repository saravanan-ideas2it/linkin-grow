let chrome = window.chrome || {};
export default chrome;

export const setCustomCookies = (cookieValue) => {
  // Calculate expiration date (60 days from now)
  const expirationDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days in milliseconds

  // Set the cookie
  chrome.cookies.set({
    url: "https://your-backend-api.com", // Update with your backend URL
    name: "atk",
    value: cookieValue,
    expirationDate: expirationDate.getTime() / 1000, // Convert to seconds
    sameSite: "Strict",
    secure: true,
  });
};

export const getCustomCookie = () => {
  chrome.cookies.get({
    url: "https://your-backend-api.com",
    name: "atk",
  });
};
