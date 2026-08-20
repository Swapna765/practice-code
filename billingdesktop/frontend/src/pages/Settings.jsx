import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
	const { user } = useAuth();
	return <div className="app-layout"><Sidebar /><main className="main-content"><Navbar /><div className="page-content"><span style={{ color: "#728078", fontSize: 11, textTransform: "uppercase" }}>Workspace</span><h1>Settings</h1><p style={{ color: "#728078" }}>Current account and connection details.</p><section style={{ maxWidth: 560, background: "#fbfaf5", border: "1px solid #e1e7dd", borderRadius: 8, padding: 22, marginTop: 22 }}><p><strong>Signed in as</strong><br />{user?.name}</p><p><strong>Email</strong><br />{user?.email}</p><p><strong>Role</strong><br />{user?.role}</p><p><strong>API</strong><br />http://localhost:3000/api</p></section></div></main></div>;
}
