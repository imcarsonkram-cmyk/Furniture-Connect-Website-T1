import { json, badRequest } from "../../../lib/http";
import { Category, Condition, SizeHint, ListingFilters, ListingCard } from "../../../lib/types";
import { db } from "../../../lib/database";
import { verifyCaptcha } from "../../../lib/captcha";
import { globalRateLimiter } from "../../../lib/rate-limit";
import { env } from "../../../lib/env";
import { storeImage } from "../../../lib/storage";
import { sanitizeText, ensureUrl } from "../../../lib/utils";

function parseBoolean(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

interface PhotoPayload {
  filename: string;
  base64: string;
  width: number;
  height: number;
}

interface CreateListingRequest {
  campusId?: string;
  dropSpotId?: string;
  lat?: number;
  lng?: number;
  locationText?: string;
  category: Category;
  condition: Condition;
  sizeHint: SizeHint;
  notes?: string;
  photos?: PhotoPayload[];
  notifyEmail?: string;
  notifyPhone?: string;
  notifyConsent?: boolean;
  captchaToken?: string;
}

export interface CreateListingResponse {
  listingId: string;
  manageUrl: string;
  status: string;
}

function normalizeEmail(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.trim().toLowerCase();
}

function normalizePhone(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/[^\d+]/g, "");
}

export async function POST(req: Request) {
  let body: CreateListingRequest | undefined;
  try {
    body = await req.json();
  } catch (e) {
    return badRequest('missing_body');
  }
  if (!body) return badRequest('missing_body');

  const allowed = await verifyCaptcha(body.captchaToken);
  if (!allowed) return badRequest('captcha_failed');

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const rateKey = `listing:${ip}:${new Date().toISOString().slice(0, 10)}`;
  if (!globalRateLimiter.check(rateKey, 10, 24 * 60 * 60 * 1000)) return badRequest('rate_limited');

  if (!body.locationText && !body.dropSpotId) return badRequest('location_required');
  if (!body.category || !body.condition || !body.sizeHint) return badRequest('missing_required_fields');

  const dropSpot = db.getDropSpotById(body.dropSpotId);
  const campusId = body.campusId ?? dropSpot?.campusId;
  const locationText = sanitizeText(body.locationText ?? dropSpot?.name ?? '');

  const photosMeta: any[] = [];
  if (body.photos) {
    for (const photo of body.photos.slice(0, 3)) {
      try {
        const buffer = Buffer.from(photo.base64, 'base64');
        const uploaded = await storeImage({ buffer, filename: photo.filename, width: photo.width, height: photo.height });
        photosMeta.push({ key: uploaded.key, width: uploaded.width, height: uploaded.height, hash: uploaded.hash });
      } catch (e) {
        // ignore image failures in offline mode
      }
    }
  }

  const listing = db.createListing({
    campusId,
    dropSpotId: body.dropSpotId,
    lat: body.lat ?? dropSpot?.lat,
    lng: body.lng ?? dropSpot?.lng,
    locationText,
    category: body.category,
    condition: body.condition,
    sizeHint: body.sizeHint,
    notes: body.notes ? sanitizeText(body.notes).slice(0, 400) : undefined,
    photos: photosMeta,
    notifyEmail: normalizeEmail(body.notifyEmail),
    notifyPhone: normalizePhone(body.notifyPhone),
    notifyConsent: Boolean(body.notifyConsent)
  });

  const manageUrl = ensureUrl(env.siteUrl, `i/${listing.id}?manage=${listing.manageToken}`);
  return json({ listingId: listing.id, manageUrl, status: listing.status });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const campusId = params.get('campus') ?? undefined;
  if (!campusId) return badRequest('campus_required');
  const filters: ListingFilters = {
    campusId,
    category: (params.get('category') as Category) || undefined,
    condition: (params.get('condition') as Condition) || undefined,
    sizeHint: (params.get('sizeHint') as SizeHint) || undefined,
    freshnessHours: params.get('freshnessHours') ? Number(params.get('freshnessHours')) : undefined,
    radiusKm: params.get('radiusKm') ? Number(params.get('radiusKm')) : undefined,
    excludeMattress: parseBoolean(params.get('excludeMattress')),
    workingOnly: parseBoolean(params.get('workingOnly'))
  };

  if (params.get('lat') && params.get('lng')) {
    filters.origin = { lat: Number(params.get('lat')), lng: Number(params.get('lng')) };
  }

  const items = db.filterListings(filters);
  return json({ items });
}
import { ApiRequest, ApiResponse, json, badRequest } from "../../../lib/http";
import { Category, Condition, SizeHint, ListingFilters, ListingCard } from "../../../lib/types";
import { db } from "../../../lib/database";
import { verifyCaptcha } from "../../../lib/captcha";
import { globalRateLimiter } from "../../../lib/rate-limit";
import { env } from "../../../lib/env";
import { storeImage } from "../../../lib/storage";
import { sanitizeText, ensureUrl } from "../../../lib/utils";

function parseBoolean(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

interface PhotoPayload {
  filename: string;
  base64: string;
  width: number;
  height: number;
}

interface CreateListingRequest {
  campusId?: string;
  dropSpotId?: string;
  lat?: number;
  lng?: number;
  locationText?: string;
  category: Category;
  condition: Condition;
  sizeHint: SizeHint;
  notes?: string;
  photos?: PhotoPayload[];
  notifyEmail?: string;
  notifyPhone?: string;
  notifyConsent?: boolean;
  captchaToken?: string;
}

export interface CreateListingResponse {
  listingId: string;
  manageUrl: string;
  status: string;
}

function normalizeEmail(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.trim().toLowerCase();
}

function normalizePhone(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/[^