import { json, badRequest, unauthorized, notFound } from "../../../../lib/http";
import { db } from "../../../../lib/database";
import { env } from "../../../../lib/env";

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${env.adminBearerToken}`) return unauthorized();
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return badRequest('missing_body');
  }
  if (!body?.listingId) return badRequest('missing_listing_id');
  const removed = db.removeListing(body.listingId);
  if (!removed) return notFound('listing_not_found');
  return json({ ok: true });
}
