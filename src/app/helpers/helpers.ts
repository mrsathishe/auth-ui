import { NotificationManager } from "react-notifications";

export function showAlert(
  message: string,
  type: "info" | "success" | "warning" | "error" = "info"
) {
  if (typeof window !== "undefined") {
    NotificationManager[type](message);
  } else {
    window.alert(message);
  }
}
