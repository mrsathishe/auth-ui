import axios from "axios";
import { FormData } from "@/constants/formData";
import { NotificationManager } from "react-notifications";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://your-production-url.com"
    : "http://localhost:8000");
export function showAlert(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) {
  switch (type) {
    case "success":
      NotificationManager.success(message);
      break;
    case "error":
      NotificationManager.error(message);
      break;
    case "warning":
      NotificationManager.warning(message);
      break;
    default:
      NotificationManager.info(message);
  }
}

export async function registerUser(formData: FormData) {
  // Map to required field names
  const payload = {
    full_name: formData.name,
    email: formData.email,
    phone_number: formData.phoneNumber,
    password: formData.password,
    building_name: formData.buildingName,
    apartment_name: formData.flatNumber,
  };
  const response = await axios.post(`${API_BASE_URL}/register`, payload);
  return response.data;
}

export async function loginUser(identifier: string, password: string) {
  // Connect to backend GET endpoint with query params
  return axios.get(`${API_BASE_URL}/login`, {
    params: { identifier, password },
  });
}
