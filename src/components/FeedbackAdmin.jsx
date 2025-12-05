import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';

const FeedbackAdmin = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    setFeedback(storage.getAllFeedback());
  }, []);

  const handleResponseChange = (id, value) => {
    setFeedback((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, responseDraft: value } : fb))
    );
  };

  const handleSaveResponse = (id) => {
    const item = feedback.find((fb) => fb.id === id);
    const updated = storage.updateFeedback(id, {
      response: item.responseDraft || item.response || '',
      respondedAt: new Date().toISOString(),
    });
    setFeedback(updated);
  };

  if (feedback.length === 0) {
    return (
      <div className="admin-panel" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ color: '#AD703C', marginBottom: '0.5rem' }}>Customer Feedback</h2>
        <p style={{ color: '#666' }}>No feedback received yet.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel" style={{ marginTop: '1.5rem' }}>
      <h2 style={{ color: '#AD703C', marginBottom: '1rem' }}>Customer Feedback</h2>
      {feedback
        .slice()
        .reverse()
        .map((fb) => (
          <div
            key={fb.id}
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '0.75rem',
            }}
          >
            <p style={{ marginBottom: '0.25rem' }}>{fb.message}</p>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
              From: {fb.customerName}{' '}
              {fb.customerEmail && `(${fb.customerEmail})`} •{' '}
              {new Date(fb.createdAt).toLocaleString()}
            </p>
            {fb.response && (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#155724',
                  background: '#d4edda',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                }}
              >
                Our Response: {fb.response}
              </p>
            )}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Reply to this feedback</label>
              <textarea
                rows="2"
                value={fb.responseDraft ?? fb.response ?? ''}
                onChange={(e) => handleResponseChange(fb.id, e.target.value)}
              />
            </div>
            <button
              className="form-btn submit-btn"
              style={{ marginTop: '0.5rem' }}
              onClick={() => handleSaveResponse(fb.id)}
            >
              Save Response
            </button>
          </div>
        ))}
    </div>
  );
};

export default FeedbackAdmin;


