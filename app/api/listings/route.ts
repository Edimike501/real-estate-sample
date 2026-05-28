// GET — returns all properties
// TODO: replace with database query (e.g. Prisma + PostgreSQL)
import { properties } from "@/metadata/properties";
export async function GET() {
  return Response.json({ properties });
}
