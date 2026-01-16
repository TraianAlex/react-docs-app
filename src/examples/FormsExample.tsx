import { useState } from 'react';

export default function FormsExample() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'Product' });
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = form.name.trim() && form.email.includes('@');

  return (
    <div className='card shadow-sm'>
      <div className='card-body'>
        <h3 className='h5 mb-3'>Contact support</h3>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
          <label className='form-label w-100'>
            Name
          <input
              className='form-control mt-1'
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder='Ada Lovelace'
          />
          </label>
          <label className='form-label w-100 mt-3'>
            Email
          <input
              className='form-control mt-1'
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder='ada@example.com'
          />
          </label>
          <label className='form-label w-100 mt-3'>
            Topic
          <select
              className='form-select mt-1'
            value={form.topic}
            onChange={(event) =>
              setForm({ ...form, topic: event.target.value })
            }
          >
            <option>Product</option>
            <option>Billing</option>
            <option>Feedback</option>
          </select>
          </label>
          <button
            className='btn btn-primary mt-3'
            type='submit'
            disabled={!canSubmit}
          >
            Send message
          </button>
          {submitted && (
            <p className='text-success fw-semibold mt-2 mb-0'>
              We will reply within 24 hours.
            </p>
          )}
      </form>
      </div>
    </div>
  );
}
