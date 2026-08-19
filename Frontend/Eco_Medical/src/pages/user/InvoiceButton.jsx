import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; // shadcn button (optional)
import { FileDown } from "lucide-react";

const InvoiceButton = ({ orderId }) => {
  const [loading, setLoading] = useState(false);

  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/invoice/${orderId}`,
        { withCredentials: true } // ensure auth cookies/JWT are sent
      );

      if (data.success && data.invoiceUrl) {
        // Open invoice PDF in new tab
        window.open(data.invoiceUrl, "_blank");
      } else {
        alert("Invoice not available yet!");
      }
    } catch (error) {
      console.error("❌ Invoice download failed:", error);
      alert("Failed to download invoice. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownloadInvoice}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <FileDown size={18} />
      {loading ? "Generating..." : "Download Invoice"}
    </Button>
  );
};

export default InvoiceButton;
