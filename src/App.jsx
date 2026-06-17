import { useAuth } from "./contexts/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CidadaoApp from "./pages/CidadaoApp.jsx";
import GestorDashboard from "./pages/GestorDashboard.jsx";
import { Spinner } from "./components/ui.jsx";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-eco-600 rounded-2xl flex items-center justify-center text-3xl animate-pulse">
            🌿
          </div>
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;
  if (user.role === "GESTOR") return <GestorDashboard />;
  return <CidadaoApp />;
}
