import { db, seedSampleData } from "../src/lib/database";

async function main() {
  seedSampleData();
  const campuses = db.listCampuses();
  console.log(`Seeded ${campuses.length} campus entries.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
