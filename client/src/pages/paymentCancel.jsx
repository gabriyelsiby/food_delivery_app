// src/pages/paymentCancel.jsx

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Payment Cancelled</h1>
      <p className="text-gray-600">Your payment was not successful. You can try again anytime.</p>
      <a 
        href="/cart"
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
      >
        Back to Cart
      </a>
    </div>
  );
};

export default PaymentCancel;
