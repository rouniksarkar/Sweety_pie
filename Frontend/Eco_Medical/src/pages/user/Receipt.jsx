import { useState } from "react";

const Receipt = ({ order }) => {
  const [invoiceBase64, setInvoiceBase64] = useState(null);

  const generateInvoice = async () => {
    const res = await fetch("/api/v1/invoice/generate-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order._id }),
    });

    const data = await res.json();
    if (data.success) {
      setInvoiceBase64(data.invoice);
    }
  };

  const handleViewInvoice = () => {
    const pdfWindow = window.open("");
    pdfWindow.document.write(
      "<iframe width='100%' height='100%' src='data:application/pdf;base64," +
        encodeURI(invoiceBase64) +
        "'></iframe>"
    );
  };

  const handleDownloadInvoice = () => {
    const link = document.createElement("a");
    link.href = "data:application/pdf;base64," + invoiceBase64;
    link.download = `invoice_${order._id}.pdf`;
    link.click();
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Order #{order._id}</h2>
      <p>Total: ₹{order.totalAmount}</p>

      {!invoiceBase64 ? (
        <button
          onClick={generateInvoice}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Generate Receipt
        </button>
      ) : (
        <div className="mt-4 space-x-4">
          <button
            onClick={handleViewInvoice}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            View Invoice
          </button>
          <button
            onClick={handleDownloadInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Download Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default Receipt;
