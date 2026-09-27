function StatCard({ title, value, icon }) {
    return (
        <article style={styles.card}>
            <div style={styles.top}><span style={styles.label}>{title}</span><span style={styles.icon}>{icon}</span></div>
            <strong style={styles.value}>{value}</strong>
        </article>
    );
}

const styles = { card: { background: "#fbfaf5", border: "1px solid #e4e8df", borderRadius: 8, padding: "18px 20px", minHeight: 110 }, top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }, label: { color: "#738079", fontSize: 12, fontWeight: 600 }, icon: { fontSize: 19 }, value: { color: "#16231f", fontSize: 25 } };

export default StatCard;
