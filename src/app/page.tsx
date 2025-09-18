import React from 'react';

export default function HomePage() {
  return (
    <section>
      <p className="muted">Zero-friction logging for students · Self-serve routing for nonprofits.</p>
      <div className="cta-grid">
        <div className="card">
          <h2>Log an item</h2>
          <p>Snap a quick photo, choose a category, and drop it at an approved zone in seconds.</p>
          <a className="button" href="/log">Start drop &amp; log</a>
        </div>
        <div className="card">
          <h2>Find items (orgs)</h2>
          <p>Browse active listings with live freshness indicators and build routes instantly.</p>
          <a className="button button-secondary" href="/orgs">Browse pickups</a>
        </div>
      </div>
    </section>
  );
}
