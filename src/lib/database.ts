// Minimal in-memory database used by the demo seed script.
// This provides the exports expected by prisma/seed.ts (db, seedSampleData)

import { ListingCard, Category, Condition, SizeHint, ListingFilters, SignalType, SignalSource } from './types';
import crypto from 'crypto';

export type Campus = {
  id: string;
  name: string;
  city?: string;
};

type Listing = ListingCard & {
  id: string;
  manageToken: string;
  createdAt: number;
  photos?: any[];
  notifyEmail?: string;
  notifyPhone?: string;
  notifyConsent?: boolean;
};

type DropSpot = { id: string; campusId: string; name: string; lat?: number; lng?: number };
type Signal = { id: string; listingId: string; type: SignalType; source: SignalSource; fingerprint: string; createdAt: number };

export const db = {
  _campuses: [] as Campus[],
  _listings: [] as Listing[],
  _dropSpots: [] as DropSpot[],
  _signals: [] as Signal[],

  listCampuses() {
    return this._campuses;
  },

  clear() {
    this._campuses = [];
    this._listings = [];
    this._dropSpots = [];
    this._signals = [];
  },

  getAcceptance() {
    return { allowed: ['furniture', 'appliance'], notAllowed: ['hazardous'] };
  },

  getDropSpotById(id?: string) {
    if (!id) return undefined;
    return this._dropSpots.find((d) => d.id === id);
  },

  createListing(data: {
    campusId?: string;
    dropSpotId?: string;
    lat?: number;
    lng?: number;
    locationText: string;
    category: Category;
    condition: Condition;
    sizeHint: SizeHint;
    notes?: string;
    photos?: any[];
    notifyEmail?: string;
    notifyPhone?: string;
    notifyConsent?: boolean;
  }) {
    const id = crypto.randomBytes(6).toString('hex');
    const manageToken = crypto.randomBytes(8).toString('hex');
    const listing: Listing = {
      id,
      manageToken,
      locationText: data.locationText,
      category: data.category,
      condition: data.condition,
      sizeHint: data.sizeHint,
      status: 'available',
      createdAt: Date.now(),
      photos: data.photos ?? [],
      notifyEmail: data.notifyEmail,
      notifyPhone: data.notifyPhone,
      notifyConsent: data.notifyConsent
    } as Listing;
    this._listings.push(listing);
    return listing;
  },

  getListing(id?: string) {
    if (!id) return undefined;
    return this._listings.find((l) => l.id === id);
  },

  removeListing(id: string) {
    const idx = this._listings.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    this._listings.splice(idx, 1);
    return true;
  },

  createSignal(listingId: string, type: SignalType, source: SignalSource, fingerprint: string) {
    const listing = this.getListing(listingId);
    if (!listing) return undefined;
    const s: Signal = { id: crypto.randomBytes(6).toString('hex'), listingId, type, source, fingerprint, createdAt: Date.now() };
    this._signals.push(s);
    // update listing status for demo
    if (type === 'picked') listing.status = 'picked_up';
    if (type === 'expired') listing.status = 'expired';
    return s;
  },

  filterListings(filters: ListingFilters) {
    return this._listings.map((l) => ({ id: l.id, locationText: l.locationText, category: l.category, condition: l.condition, sizeHint: l.sizeHint, status: l.status }));
  }
};

export function seedSampleData() {
  db.clear();
  db._campuses.push({ id: 'campus-1', name: 'Main Campus', city: 'Hometown' });
  db._dropSpots.push({ id: 'spot-1', campusId: 'campus-1', name: 'Drop Zone A', lat: 0, lng: 0 });
  const l = db.createListing({ locationText: 'Couch near library', category: 'furniture', condition: 'good', sizeHint: 'large' });
}

export default db;
