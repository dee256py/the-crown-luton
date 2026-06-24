export const API_BASE_URL = "http://localhost:5050";

export function saveAdminToken(token) {
  localStorage.setItem("castleAdminToken", token);
}

export function getAdminToken() {
  return localStorage.getItem("castleAdminToken");
}

export function removeAdminToken() {
  localStorage.removeItem("castleAdminToken");
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

export async function apiFetch(path, options = {}) {
  const token = getAdminToken();

  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    removeAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Admin login required.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export async function downloadProtectedFile(path, filename) {
  const token = getAdminToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401 || response.status === 403) {
    removeAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Admin login required.");
  }

  if (!response.ok) {
    throw new Error("Download failed.");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}