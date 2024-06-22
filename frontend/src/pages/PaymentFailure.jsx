import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const { theatreId, showId } = useParams();

  const handleRetry = () => {
    navigate(`/seat-selection/${showId}/${theatreId}`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Payment Failed</h1>
      <p>Unfortunately, your payment could not be processed. Please try again.</p>
      <button onClick={handleRetry} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Retry Payment
      </button>
    </div>
  );
};

export default PaymentFailure;
