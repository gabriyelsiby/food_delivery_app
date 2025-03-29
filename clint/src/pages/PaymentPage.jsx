// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import axios from "axios";

const PaymentPage = ({ orderId }) => {
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = () => {
    setProcessing(true);
    axios
      .post(
        "http://localhost:5000/api/payment/process-payment",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setMessage("Payment processed successfully!");
        setProcessing(false);
      })
      .catch((error) => {
        console.error("Payment error", error);
        setMessage("Payment failed. Please try again.");
        setProcessing(false);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <button
        onClick={handlePayment}
        disabled={processing}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default PaymentPage;
