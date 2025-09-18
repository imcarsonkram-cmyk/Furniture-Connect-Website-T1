import { json, badRequest, notFound } from "../../../../../lib/http";
import { db } from "../../../../../lib/database";
import { SignalType, SignalSource } from "../../../../../lib/types";
import { globalRateLimiter } from "../../../../../lib/rate-limit";
import { hashText } from "../../../../../lib/utils";

export async function POST(req: Request, { params }: { params: { id?: string } }) {
  const listingId = params?.id;
  if (!listingId) return badRequest('missing_listing_id');
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return badRequest('missing_body');
  }
  if (!body) return badRequest('missing_body');
  if (!body.type || !body.source) return badRequest('missing_type_or_source');

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const rateKey = `signal:${ip}:${new Date().toISOString().slice(0, 10)}`;
  if (!globalRateLimiter.check(rateKey, 30, 24 * 60 * 60 * 1000)) return badRequest('rate_limited');

  const listing = db.getListing(listingId);
  if (!listing) return notFound('listing_not_found');

  const fingerprintSeed = `${listingId}:${ip}:${req.headers.get('x-device-id') ?? ''}`;
  const fingerprint = hashText(fingerprintSeed).slice(0, 24);
  const signal = db.createSignal(listingId, body.type as SignalType, body.source as SignalSource, fingerprint);
  if (!signal) return notFound('listing_not_found');

  const updated = db.getListing(listingId)!;
  return json({ status: updated.status });
}
