// src/pages/PaymentSuccess.jsx

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-gray-700">Thank you for your order. Your payment has been confirmed.</p>
      <a 
        href="/orders"
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
      >
        View Orders
      </a>
    </div>
  );
};

export default PaymentSuccess;
