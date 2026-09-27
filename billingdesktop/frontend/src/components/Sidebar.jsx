import { Link, useLocation } from "react-router-dom";
import { BarChart3, Boxes, ChevronRight, FileText, LayoutDashboard, LogOut, Package, RotateCcw, Settings, ShoppingCart, Store, Truck, Users, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Billing", path: "/billing", icon: FileText, roles: ["admin", "cashier"] },
    { label: "Products", path: "/products", icon: Package },
    { label: "Categories", path: "/categories", icon: Boxes, roles: ["admin"] },
    { label: "Customers", path: "/customers", icon: Users },
    { label: "Inventory", path: "/inventory", icon: Store },
    { label: "Purchases", path: "/purchases", icon: ShoppingCart, roles: ["admin"] },
    { label: "Suppliers", path: "/suppliers", icon: Truck, roles: ["admin"] },
    { label: "Returns", path: "/returns", icon: RotateCcw, roles: ["admin", "cashier"] },
    { label: "Reports", path: "/reports", icon: BarChart3, roles: ["admin"] },
    { label: "Users", path: "/users", icon: Users, roles: ["admin"] },
    { label: "Settings", path: "/settings", icon: Settings },
];

function Sidebar({ open = true, onClose }) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const visibleLinks = links.filter((link) => !link.roles || link.roles.includes(user?.role));

    return (
        <aside className={`sidebar ${open ? "sidebar-open" : ""}`} style={styles.sidebar}>
            <div style={styles.brandRow}>
                <div style={styles.brandMark}>BD</div>
                <div><strong>Billing Desk</strong><small style={styles.muted}>Retail operations</small></div>
                <button aria-label="Close menu" onClick={onClose} style={styles.close}><X size={18} /></button>
            </div>
            <nav style={styles.nav}>
                <span style={styles.section}>Workspace</span>
                {visibleLinks.map(({ label, path, icon: Icon }) => (
                    <Link key={path} to={path} style={{ ...styles.link, ...(location.pathname === path ? styles.active : {}) }}>
                        <Icon size={17} /><span>{label}</span>{location.pathname === path && <ChevronRight size={15} style={{ marginLeft: "auto" }} />}
                    </Link>
                ))}
            </nav>
            <div style={styles.profile}>
                <div style={styles.avatar}>{user?.name?.slice(0, 1).toUpperCase() || "U"}</div>
                <div style={{ minWidth: 0, flex: 1 }}><strong style={styles.truncate}>{user?.name || "User"}</strong><small style={styles.muted}>{user?.role || "staff"}</small></div>
                <button aria-label="Log out" title="Log out" onClick={logout} style={styles.close}><LogOut size={17} /></button>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: { position: "fixed", inset: "0 auto 0 0", width: 250, zIndex: 50, display: "flex", flexDirection: "column", background: "#16231f", color: "#f7f4ea", padding: "22px 14px", boxShadow: "8px 0 24px rgba(21,35,31,.08)", transition: "transform .2s ease" },
    brandRow: { display: "flex", alignItems: "center", gap: 10, padding: "0 8px 26px", fontSize: 16 },
    brandMark: { width: 35, height: 35, display: "grid", placeItems: "center", borderRadius: 9, background: "#d6e75b", color: "#16231f", fontWeight: 800, fontSize: 12 },
    muted: { display: "block", color: "#99aaa3", fontSize: 11, marginTop: 3, textTransform: "capitalize" },
    nav: { display: "flex", flexDirection: "column", gap: 4, overflowY: "auto", flex: 1 },
    section: { color: "#71857d", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, padding: "0 12px 8px" },
    link: { display: "flex", alignItems: "center", gap: 11, color: "#b9c7c1", textDecoration: "none", padding: "10px 12px", borderRadius: 7, fontSize: 13 },
    active: { background: "#d6e75b", color: "#16231f", fontWeight: 700 },
    profile: { display: "flex", alignItems: "center", gap: 9, borderTop: "1px solid #31423c", padding: "16px 8px 0", fontSize: 12 },
    avatar: { width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", background: "#31423c", color: "#d6e75b", fontWeight: 700 },
    close: { marginLeft: "auto", display: "grid", placeItems: "center", background: "transparent", border: 0, color: "inherit", padding: 4 },
    truncate: { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
};

export default Sidebar;
