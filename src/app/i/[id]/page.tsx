import React from 'react';

type Props = { params: { id: string } };

export default function ListingPage({ params }: Props) {
  const { id } = params;
  return (
    <section>
      <h1>Listing {id}</h1>
      <p>Details for listing <strong>{id}</strong> would show here.</p>
      <p className="muted">In demo mode this reads from an in-memory store.</p>
    </section>
  );
}
