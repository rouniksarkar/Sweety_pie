import InvoiceButton from "./InvoiceButton";

const OrderSummary = ({ order }) => {
  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-lg font-semibold">Order #{order._id}</h2>
      <p>Total Paid: ₹{order.totalAmount}</p>

      {/* ✅ Show download invoice */}
      <InvoiceButton orderId={order._id} />
    </div>
  );
};

export default OrderSummary;
