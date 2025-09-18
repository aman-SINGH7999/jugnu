import { getResults } from "@/controllers/resultController";

export async function GET() {
  return getResults();
}
