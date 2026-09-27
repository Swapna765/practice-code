import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const titles = { "/dashboard": "Dashboard", "/billing": "Billing", "/products": "Products", "/categories": "Categories", "/customers": "Customers", "/inventory": "Inventory", "/purchases": "Purchases", "/suppliers": "Suppliers", "/returns": "Returns", "/reports": "Reports", "/users": "Users", "/settings": "Settings" };

function Navbar({ onMenuClick }) {
    const location = useLocation();
    const { user } = useAuth();
    return (
        <header style={styles.header}>
            <button aria-label="Open menu" onClick={onMenuClick} className="mobile-menu-button" style={styles.menu}><Menu size={20} /></button>
            <div><span style={styles.eyebrow}>Operations / </span><strong>{titles[location.pathname] || "Billing Desk"}</strong></div>
            <div style={styles.right}><div className="navbar-search" style={styles.search}><Search size={16} color="#738079" /><input aria-label="Search" placeholder="Search records" /></div><span className="navbar-date" style={styles.date}>{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span><span style={styles.user}>{user?.name}</span></div>
        </header>
    );
}

const styles = { header: { height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", background: "#fbfaf5", borderBottom: "1px solid #e4e8df", color: "#16231f" }, eyebrow: { color: "#8b9690", fontSize: 12 }, right: { display: "flex", alignItems: "center", gap: 18 }, search: { display: "flex", alignItems: "center", gap: 7, background: "#f0f2eb", borderRadius: 6, padding: "8px 11px" }, input: { border: 0 }, date: { color: "#738079", fontSize: 12 }, user: { fontWeight: 700, fontSize: 13 }, menu: { background: "transparent", border: 0, color: "#16231f" } };

export default Navbar;
