import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

import API from "../services/api";


function Dashboard() {

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response =
                    await API.get(
                        "/dashboard"
                    );


                if (
                    response.data.success
                ) {

                    setData(
                        response.data.dashboard
                    );

                }

            } catch (error) {

                console.error(
                    error
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load dashboard"
                );

            } finally {

                setLoading(false);

            }
        };


        fetchDashboard();

    }, []);


    if (loading) {

        return (
            <div
                style={{
                    padding: "40px"
                }}
            >
                Loading dashboard...
            </div>
        );

    }


    if (error) {

        return (
            <div
                style={{
                    padding: "40px",
                    color: "red"
                }}
            >
                {error}
            </div>
        );

    }


    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f3f4f6"
            }}
        >

            <Sidebar />


            <main className="main-content">

                <Navbar />


                <div
                    style={{
                        padding: "25px"
                    }}
                >

                    {/* Page title */}

                    <div
                        className="dashboard-stats"
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0
                            }}
                        >
                            Dashboard
                        </h1>

                        <p
                            style={{
                                color:
                                    "#6b7280"
                            }}
                        >
                            Welcome back! Here's
                            what's happening
                            in your store.
                        </p>

                    </div>


                    {/* Statistics */}

                    <div
                        className="dashboard-lower"
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(4, 1fr)",
                            gap: "20px"
                        }}
                    >

                        <StatCard
                            title="Today's Sales"
                            value={`₹${data.today.sales}`}
                            icon="💰"
                        />


                        <StatCard
                            title="Today's Invoices"
                            value={
                                data.today
                                    .invoices
                            }
                            icon="🧾"
                        />


                        <StatCard
                            title="Total Products"
                            value={
                                data.totals
                                    .products
                            }
                            icon="📦"
                        />


                        <StatCard
                            title="Customers"
                            value={
                                data.totals
                                    .customers
                            }
                            icon="👥"
                        />


                        <StatCard
                            title="Suppliers"
                            value={
                                data.totals
                                    .suppliers
                            }
                            icon="🚚"
                        />


                        <StatCard
                            title="Total Sales"
                            value={`₹${data.totals.sales}`}
                            icon="📈"
                        />


                        <StatCard
                            title="Purchases"
                            value={`₹${data.totals.purchases}`}
                            icon="🛒"
                        />


                        <StatCard
                            title="Returns"
                            value={`₹${data.totals.returns}`}
                            icon="↩️"
                        />

                    </div>


                    {/* Lower section */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "2fr 1fr",
                            gap: "20px",
                            marginTop: "25px"
                        }}
                    >

                        {/* Sales */}

                        <div
                            style={{
                                background:
                                    "white",
                                padding:
                                    "25px",
                                borderRadius:
                                    "10px"
                            }}
                        >

                            <h2>
                                Sales Overview
                            </h2>

                            {data.dailySales
                                ?.map(
                                    (day) => (

                                        <div
                                            key={
                                                day.date
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                padding:
                                                    "10px 0",
                                                borderBottom:
                                                    "1px solid #eee"
                                            }}
                                        >

                                            <span>
                                                {
                                                    day.date
                                                }
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    day.sales
                                                }
                                            </strong>

                                        </div>

                                    )
                                )}

                        </div>


                        {/* Low stock */}

                        <div
                            style={{
                                background:
                                    "white",
                                padding:
                                    "25px",
                                borderRadius:
                                    "10px"
                            }}
                        >

                            <h2>
                                Low Stock
                            </h2>


                            {data
                                .lowStockProducts
                                ?.length === 0 ? (

                                <p>
                                    No low stock
                                    products 🎉
                                </p>

                            ) : (

                                data
                                    .lowStockProducts
                                    ?.map(
                                        product => (

                                            <div
                                                key={
                                                    product._id
                                                }
                                                style={{
                                                    padding:
                                                        "10px 0",
                                                    borderBottom:
                                                        "1px solid #eee"
                                                }}
                                            >

                                                <strong>
                                                    {
                                                        product.name
                                                    }
                                                </strong>

                                                <div>
                                                    Stock:
                                                    {" "}
                                                    {
                                                        product.stock
                                                    }
                                                </div>

                                            </div>

                                        )
                                    )

                            )}

                        </div>

                    </div>


                    {/* Profit */}

                    <div
                        style={{
                            marginTop: "20px",
                            background:
                                "white",
                            padding: "25px",
                            borderRadius:
                                "10px"
                        }}
                    >

                        <h2>
                            Estimated Profit
                        </h2>

                        <h1>
                            ₹
                            {
                                data.totals
                                    .estimatedProfit
                            }
                        </h1>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;