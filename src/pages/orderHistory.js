import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetch(`http://localhost:5000/orders?userId=${userId}`)
            .then(res => res.json())
            .then(data => setOrders(data.orders));
    }, []);

    return (
        <div>
            <Header />
            <div className="main-section">
                <h2>Order History</h2>
                {orders.length === 0 ? (
                    <p>You have not placed any orders yet.</p>
                ) : (
                    orders.map((order, i) => (
                        <div key={order.orderId} className="order-list">
                            <p><strong>Order #{i + 1}</strong></p>
                            <p>{order.timestamp}</p>
                            {order.items.map((item, j) => (
                                <p key={j}>{item.name} x {item.quantity} = ${item.price}</p>
                            ))}
                            <p><strong>Total: ${order.total}</strong></p>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
}

export default OrderHistoryPage;