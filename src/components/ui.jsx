import { STATUS, CATEGORIAS } from "../utils/helpers.js";

// Logo component
export const Logo = ({ size = "md" }) => {
  const sizes = {
    sm: "w-7 h-7 text-sm",
    md: "w-9 h-9 text-base",
    lg: "w-12 h-12 text-xl",
  };
  return (
    <div
      className={`${sizes[size]} bg-eco-600 rounded-xl flex items-center justify-center flex-shrink-0`}
    >
      <span>🌿</span>
    </div>
  );
};

// Status badge
export const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.ABERTA;
  return (
    <span className={`badge ${s.cor}`}>
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
};

// Category badge
export const CategoriaBadge = ({ categoria }) => {
  const c = CATEGORIAS[categoria] || CATEGORIAS.OUTROS;
  return (
    <span className={`badge ${c.cor}`}>
      {c.emoji} {c.label}
    </span>
  );
};

// Loading spinner
export const Spinner = ({ size = "md", color = "eco" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div
      className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin text-${color}-600`}
    />
  );
};

// Empty state
export const EmptyState = ({ icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="text-5xl mb-4">{icon || "📭"}</div>
    <h3 className="font-semibold text-gray-700 text-lg mb-1">{title}</h3>
    {subtitle && <p className="text-gray-500 text-sm mb-4">{subtitle}</p>}
    {action}
  </div>
);

// Modal overlay
export const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-elevated
                      max-h-[90vh] overflow-auto animate-slide-up"
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// Toast notification
export const Toast = ({ toasts, removeToast }) => (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-elevated text-white text-sm font-medium
        animate-slide-up pointer-events-auto
        ${t.type === "error" ? "bg-red-500" : t.type === "warning" ? "bg-yellow-500" : "bg-eco-600"}`}
      >
        <span>
          {t.type === "error" ? "⚠️" : t.type === "warning" ? "⚡" : "✅"}
        </span>
        {t.message}
      </div>
    ))}
  </div>
);

// Toast hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000,
    );
  };
  return { toasts, addToast };
};

// XP Progress bar
export const XPBar = ({ xpAtual, xpProximo, tituloNivel }) => {
  const pct =
    xpProximo > 0
      ? Math.min((xpAtual / (xpAtual + xpProximo)) * 100, 100)
      : 100;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-semibold text-sm">{tituloNivel}</span>
        <span className="text-xs text-white/80">{xpAtual} XP</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {xpProximo > 0 && (
        <p className="text-xs text-white/70 mt-1">
          {xpProximo} XP para o próximo nível
        </p>
      )}
    </div>
  );
};

// Import useState for useToast
import { useState } from "react";
