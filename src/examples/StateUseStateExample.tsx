import { useState } from 'react';

export default function StateUseStateExample() {
  const [quantity, setQuantity] = useState(1);
  const price = 24;
  const total = quantity * price;

  return (
    <div className='card shadow-sm'>
      <div className='card-body d-flex flex-column gap-2'>
        <h3 className='h5 mb-0'>Subscription seats</h3>
        <p className='text-secondary mb-1'>Add or remove seats for your team.</p>
        <div className='d-flex align-items-center gap-2'>
        <button
          className='btn btn-outline-secondary'
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        >
          -
        </button>
        <span className='fw-semibold px-2'>{quantity}</span>
        <button
          className='btn btn-primary'
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          +
        </button>
        </div>
        <div>
          Total: <strong>${total}</strong> / month
        </div>
      </div>
    </div>
  );
}
