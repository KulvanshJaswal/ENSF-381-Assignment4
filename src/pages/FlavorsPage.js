import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlavorCatalog from "../components/FlavorCatalog";
import OrderList from "../components/OrderList";

function FlavorsPage() {
  const [flavors, setFlavors] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch("http://localhost:5000/flavors")
      .then(res => res.json())
      .then(data => setFlavors(data.flavors));

    fetch(`http://localhost:5000/cart?userId=${userId}`)
      .then(res => res.json())
      .then(data => setCart(data.cart));
  }, []);

  const addToOrder = (flavor) => {
    const exist = cart.find(item => item.flavorId === flavor.id);

    if (exist) {
      fetch("http://localhost:5000/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), flavorId: flavor.id, quantity: exist.quantity + 1 })
      })
        .then(res => res.json())
        .then(data => setCart(data.cart));
    } else {
      fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), flavorId: flavor.id })
      })
        .then(res => res.json())
        .then(data => setCart(data.cart));
    }
  };

  const removeItem = (flavorId) => {
    fetch("http://localhost:5000/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: parseInt(userId), flavorId: flavorId })
    })
      .then(res => res.json())
      .then(data => setCart(data.cart));
  };

  const placeOrder = () => {
    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: parseInt(userId) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage("Order placed successfully!");
          setMessageType("success");
          setCart([]);
        } else {
          setMessage(data.message);
          setMessageType("error");
        }
      });
  };

  return (
    <div className="flavors-page">
      <Header />
      <div className="content">
        <FlavorCatalog flavors={flavors} addToOrder={addToOrder} />
        <OrderList cart={cart} removeItem={removeItem} placeOrder={placeOrder} />
        {message && <p style={{ color: messageType === "error" ? "red" : "green" }}>{message}</p>}
      </div>
      <Footer />
    </div>
  );
}

export default FlavorsPage;