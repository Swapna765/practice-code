import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function Reports() {
	const [report, setReport] = useState(null);
	const [error, setError] = useState("");
	useEffect(() => { API.get("/reports/profit").then((response) => setReport(response.data.report || response.data)).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load report")); }, []);
	return <div className="app-layout"><Sidebar /><main className="main-content"><Navbar /><div className="page-content"><span style={{ color: "#728078", fontSize: 11, textTransform: "uppercase" }}>Insights</span><h1>Reports</h1><p style={{ color: "#728078" }}>Profitability from the records in your server.</p>{error && <p style={{ color: "#a33b2b" }}>{error}</p>}<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginTop: 22 }}>{Object.entries(report || {}).map(([key, value]) => <div key={key} style={{ background: "#fbfaf5", border: "1px solid #e1e7dd", borderRadius: 8, padding: 20 }}><small style={{ color: "#728078" }}>{key.replace(/[A-Z]/g, (letter) => ` ${letter}`)}</small><h2>{typeof value === "number" ? `₹${value.toFixed(2)}` : String(value)}</h2></div>)}</div></div></main></div>;
}
