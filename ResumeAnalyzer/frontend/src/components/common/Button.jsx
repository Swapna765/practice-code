import "./Button.css";

function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-button ${variant} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;