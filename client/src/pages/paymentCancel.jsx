import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="payment-cancel-container">
      <h1>Payment Cancelled</h1>
      <p>Unfortunately, your payment has been cancelled. If this was a mistake, you can try again.</p>
      {sessionId && (
        <p>Session ID: {sessionId}</p>
      )}
      <button onClick={() => window.location.href = '/checkout'}>Return to Checkout</button>
    </div>
  );
};

export default PaymentCancel;
