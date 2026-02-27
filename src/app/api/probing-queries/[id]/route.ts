import { NextRequest } from "next/server";
import { probingQueries, citationRecords } from "@/lib/seed-data";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const query = probingQueries.find(q => q.id === id);
  if (!query) {
    return createErrorResponse("NOT_FOUND", "クエリが見つかりません。", 404);
  }
  const citations = citationRecords.filter(r => r.probingQueryId === id);
  return createApiResponse({ data: { ...query, citations } });
}
