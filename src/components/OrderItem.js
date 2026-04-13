import React from "react";

function OrderItem({ item, removeItem }) {
return (
<div>
<p>{item.name}</p>
<p>Quantity: {item.quantity}</p>
<p>Price: ${item.price}</p>
<button className="remove" onClick={() => removeItem(item.flavorId)}>Remove Item</button>
</div>
);
}

export default OrderItem;