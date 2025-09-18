import { json } from "../../../../lib/http";
import { db } from "../../../../lib/database";

export async function GET(_req: Request) {
  const acceptance = db.getAcceptance();
  return json(acceptance);
}
