  import React from "react";
  import OrderItem from "./OrderItem";

  function OrderList({ cart, removeItem, placeOrder }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
  <>
  <h3>Your Order</h3>
  <div className="order-list">
  {cart.length === 0 && <p>No items in your order.</p>}
  {cart.map((item) => (
  <OrderItem key={item.flavorId} item={item} removeItem={removeItem} />
  ))}
  {cart.length > 0 && (
  <>
  <h4>Total: ${totalPrice.toFixed(2)}</h4>
  <button onClick={placeOrder}>Place Order</button>
  </>
  )}
  </div>
  </>
  );
  }

  export default OrderList;