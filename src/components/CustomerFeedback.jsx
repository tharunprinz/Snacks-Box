import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';

const CustomerFeedback = () => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const all = storage.getAllFeedback ? storage.getAllFeedback() : [];
    setFeedbackList(all.slice(-5)); // show last 5 for context
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);

    const customer = storage.getCustomer();
    const entry = {
      id: Date.now(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      customerName: customer?.name || 'Guest',
      customerEmail: customer?.email || '',
      response: '',
      respondedAt: null,
    };

    const updated = storage.addFeedback
      ? storage.addFeedback(entry)
      : [...feedbackList, entry];
    setFeedbackList(updated.slice(-5));
    setMessage('');
    setSubmitting(false);
  };

  return (
    <section style={{ marginTop: '3rem' }}>
      <h2 className="section-title">Customer Feedback</h2>
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Share your experience or suggestions. Your feedback helps us serve you better.
      </p>
      <form onSubmit={handleSubmit} className="admin-form" style={{ padding: '1.5rem' }}>
        <div className="form-group">
          <label>Your Feedback</label>
          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you liked, what we can improve, or what you'd love to see next."
          />
        </div>
        <button
          type="submit"
          className="form-btn submit-btn"
          disabled={submitting}
          style={{ width: '100%' }}
        >
          {submitting ? 'Sending...' : 'Submit Feedback'}
        </button>
      </form>

      {feedbackList.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#AD703C', marginBottom: '0.5rem' }}>Recent Feedback</h3>
          {feedbackList.map((fb) => (
            <div
              key={fb.id}
              style={{
                background: '#f5f5f5',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              <p style={{ marginBottom: '0.25rem' }}>{fb.message}</p>
              <p style={{ color: '#999', fontSize: '0.8rem' }}>
                — {fb.customerName}{' '}
                {new Date(fb.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CustomerFeedback;


