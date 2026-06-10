export const setAuthUser = (user) => {
  if (!user || !user.name) return;
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("authChange"));
}

export const clearAuthUser = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("authChange"));
};