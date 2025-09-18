import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Drop & Log Furniture Diversion',
  description: 'Log abandoned items and help nonprofits self-route pickups.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <header className="top-nav">
          <div className="container">
            <h1>Drop &amp; Log</h1>
            <nav>
              <a href="/">Home</a>
              <a href="/log">Log an item</a>
              <a href="/orgs">Find items</a>
              <a href="/spots">Drop spots</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>Leave usable items at approved drop zones during move-out. Partners may pick up what they can. Items not collected may be disposed of by property staff.</p>
        </footer>
      </body>
    </html>
  );
}
