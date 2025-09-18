import React from 'react';
import RootLayout from '../layout';

export default function AdminPage() {
  return (
    <section>
      <h2>Admin dashboard</h2>
      <p className="muted">Authenticate with the bearer token before submitting changes.</p>
      <div className="card">
        <h3>Metrics snapshot</h3>
        <ul>
          <li><strong>Items logged:</strong> <span data-metric="logged">--</span></li>
          <li><strong>Picked up:</strong> <span data-metric="picked">--</span></li>
          <li><strong>Expired:</strong> <span data-metric="expired">--</span></li>
          <li><strong>Estimated tons diverted:</strong> <span data-metric="tons">--</span></li>
        </ul>
      </div>
      <div className="card">
        <h3>Create drop spot</h3>
        <form id="admin-drop-spot">
          <label>Campus ID <input name="campusId" required /></label>
          <label>Name <input name="name" required /></label>
          <label>Latitude <input name="lat" type="number" step="0.0001" required /></label>
          <label>Longitude <input name="lng" type="number" step="0.0001" required /></label>
          <label>Access notes <textarea name="accessNotes"></textarea></label>
          <button className="button" type="submit">Save drop spot</button>
        </form>
      </div>
      <div className="card">
        <h3>Acceptance rules override</h3>
        <textarea rows={4} placeholder='{"allowed":["example"],"notAllowed":["example"]}' />
        <button className="button button-secondary" type="button">Apply override</button>
      </div>
    </section>
  );
}
