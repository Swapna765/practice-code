import { useEffect, useState } from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

const configs = {
    categories: { title: "Categories", endpoint: "/categories", key: "categories", fields: [{ name: "name", label: "Name", required: true }, { name: "description", label: "Description" }] },
    customers: { title: "Customers", endpoint: "/customers", key: "customers", fields: [{ name: "name", label: "Name", required: true }, { name: "phone", label: "Phone", required: true }, { name: "email", label: "Email", type: "email" }, { name: "address", label: "Address" }, { name: "gstNumber", label: "GST number" }] },
    suppliers: { title: "Suppliers", endpoint: "/suppliers", key: "suppliers", fields: [{ name: "name", label: "Contact name", required: true }, { name: "companyName", label: "Company" }, { name: "phone", label: "Phone", required: true }, { name: "email", label: "Email", type: "email" }, { name: "address", label: "Address" }, { name: "gstNumber", label: "GST number" }] },
    users: { title: "Users", endpoint: "/users", key: "users", fields: [{ name: "name", label: "Name", required: true }, { name: "email", label: "Email", type: "email", required: true }, { name: "password", label: "Temporary password", type: "password", required: true }, { name: "role", label: "Role", type: "select", options: ["admin", "cashier"] }, { name: "phone", label: "Phone" }] },
    invoices: { title: "Invoices", endpoint: "/invoices", key: "invoices", fields: [{ name: "customer", label: "Customer ID" }, { name: "items", label: "Items JSON", type: "textarea", required: true, placeholder: '[{"product":"PRODUCT_ID","quantity":1,"price":100,"taxRate":0}]' }, { name: "discount", label: "Discount", type: "number" }, { name: "paymentMethod", label: "Payment method" }, { name: "amountPaid", label: "Amount paid", type: "number" }] },
    purchases: { title: "Purchases", endpoint: "/purchases", key: "purchases", fields: [{ name: "supplier", label: "Supplier ID", required: true }, { name: "invoiceNumber", label: "Supplier invoice number", required: true }, { name: "items", label: "Items JSON", type: "textarea", required: true, placeholder: '[{"product":"PRODUCT_ID","quantity":1,"purchasePrice":100,"taxRate":0}]' }, { name: "paymentStatus", label: "Payment status" }, { name: "notes", label: "Notes" }] },
    returns: { title: "Returns", endpoint: "/returns", key: "returns", fields: [{ name: "invoiceId", label: "Invoice ID", required: true }, { name: "items", label: "Items JSON", type: "textarea", required: true, placeholder: '[{"product":"PRODUCT_ID","quantity":1,"reason":"Damaged"}]' }, { name: "refundMethod", label: "Refund method" }] },
    inventory: { title: "Inventory", endpoint: "/inventory", key: "inventory", fields: [] },
};

function formatValue(value) {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "object") return value.name || value.companyName || value._id || JSON.stringify(value);
    return String(value);
}

function ResourcePage({ resource }) {
    const config = configs[resource];
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({});
    const [query, setQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const response = await API.get(config.endpoint);
            setRecords(response.data[config.key] || []);
            setMessage("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Unable to load records");
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [resource]);

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form };
            for (const field of config.fields) {
                if (field.type === "number" && payload[field.name] !== "") payload[field.name] = Number(payload[field.name]);
                if (field.name === "items") payload[field.name] = JSON.parse(payload[field.name]);
            }
            await API.post(config.endpoint, payload);
            setForm({}); setShowForm(false); setMessage("Saved successfully"); await load();
        } catch (error) {
            setMessage(error instanceof SyntaxError ? "Items must be valid JSON" : error.response?.data?.message || "Unable to save record");
        } finally { setSaving(false); }
    };

    const visible = records.filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase()));
    const columns = records.length ? Object.keys(records[0]).filter((key) => !["__v", "password", "items"].includes(key)).slice(0, 7) : [];

    return <div className="app-layout"><Sidebar /><main className="main-content"><Navbar /><div className="page-content">
        <div style={styles.heading}><div><span style={styles.kicker}>Workspace</span><h1 style={styles.title}>{config.title}</h1><p style={styles.subtitle}>Manage {config.title.toLowerCase()} connected to your billing system.</p></div><div style={styles.actions}><button title="Refresh" onClick={load} style={styles.iconButton}><RefreshCw size={17} /></button>{config.fields.length > 0 && <button onClick={() => setShowForm(!showForm)} style={styles.primary}><Plus size={17} /> New {config.title.slice(0, -1)}</button>}</div></div>
        {message && <div style={styles.notice}>{message}</div>}
        {showForm && <form onSubmit={submit} style={styles.form}><div style={styles.formHeader}><h2 style={styles.formTitle}>Create {config.title.slice(0, -1)}</h2><span style={styles.hint}>Fields marked required are checked by the server.</span></div><div style={styles.grid}>{config.fields.map((field) => <label key={field.name} style={styles.label}>{field.label}{field.required && " *"}{field.type === "textarea" ? <textarea required={field.required} rows={4} placeholder={field.placeholder} value={form[field.name] || ""} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} /> : field.type === "select" ? <select required={field.required} value={form[field.name] || "cashier"} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input required={field.required} type={field.type || "text"} placeholder={field.placeholder} value={form[field.name] || ""} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />}</label>)}</div><button disabled={saving} type="submit" style={styles.primary}>{saving ? "Saving..." : "Save record"}</button></form>}
        <section style={styles.panel}><div style={styles.toolbar}><strong>{records.length} records</strong><label style={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter records" /></label></div>{loading ? <p style={styles.empty}>Loading...</p> : visible.length === 0 ? <p style={styles.empty}>No records found.</p> : <div style={{ overflowX: "auto" }}><table style={styles.table}><thead><tr>{columns.map((column) => <th key={column}>{column.replace(/[A-Z]/g, (letter) => ` ${letter}`).toUpperCase()}</th>)}</tr></thead><tbody>{visible.map((record) => <tr key={record._id}>{columns.map((column) => <td key={column}>{formatValue(record[column])}</td>)}</tr>)}</tbody></table></div>}</section>
    </div></main></div>;
}

const styles = { heading: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, marginBottom: 25 }, kicker: { color: "#728078", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4 }, title: { margin: "7px 0 3px", fontSize: 30 }, subtitle: { margin: 0, color: "#728078", fontSize: 13 }, actions: { display: "flex", gap: 8 }, iconButton: { display: "grid", placeItems: "center", border: "1px solid #dce3d9", background: "#fbfaf5", borderRadius: 6, padding: "10px 12px", color: "#16231f" }, primary: { display: "inline-flex", alignItems: "center", gap: 7, border: 0, borderRadius: 6, padding: "10px 14px", background: "#16231f", color: "#f7f4ea", fontWeight: 700 }, notice: { background: "#edf4d2", color: "#43520c", padding: "11px 14px", borderRadius: 6, marginBottom: 16, fontSize: 13 }, form: { background: "#fbfaf5", border: "1px solid #e1e7dd", borderRadius: 8, padding: 20, marginBottom: 20 }, formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 17 }, formTitle: { margin: 0, fontSize: 18 }, hint: { color: "#728078", fontSize: 12 }, grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 16 }, label: { display: "flex", flexDirection: "column", gap: 7, color: "#56645e", fontSize: 12, fontWeight: 700 }, input: {}, formControl: {}, panel: { background: "#fbfaf5", border: "1px solid #e1e7dd", borderRadius: 8, overflow: "hidden" }, toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #e1e7dd", color: "#56645e", fontSize: 13 }, search: { display: "flex", alignItems: "center", gap: 8, border: "1px solid #dce3d9", borderRadius: 5, padding: "7px 9px", color: "#728078" }, empty: { padding: 28, color: "#728078" }, table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
};

export default ResourcePage;
