import React from 'react';

export default function LogPage() {
  return (
    <section>
      <h1>Log item</h1>
      <p>Upload a photo, pick a category, and we'll route it for donation pickup.</p>
      <p className="muted">(This demo uses an in-memory database; uploads are not persistent.)</p>
    </section>
  );
}
