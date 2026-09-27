
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import Returns from "./pages/Returns";
import Settings from "./pages/Settings";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";

function ProtectedRoute({ children, roles }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/billing" element={<ProtectedRoute roles={["admin", "cashier"]}><Billing /></ProtectedRoute>} />
                    <Route path="/categories" element={<ProtectedRoute roles={["admin"]}><Categories /></ProtectedRoute>} />
                    <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                    <Route path="/purchases" element={<ProtectedRoute roles={["admin"]}><Purchases /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute roles={["admin"]}><Reports /></ProtectedRoute>} />
                    <Route path="/returns" element={<ProtectedRoute roles={["admin", "cashier"]}><Returns /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute roles={["admin"]}><Suppliers /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute roles={["admin"]}><Users /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;