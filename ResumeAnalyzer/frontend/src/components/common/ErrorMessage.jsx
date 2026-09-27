import { AlertCircle } from "lucide-react";
import "./ErrorMessage.css";

function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="error-message">
      <AlertCircle size={20} />

      <div>
        <strong>Something went wrong</strong>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;