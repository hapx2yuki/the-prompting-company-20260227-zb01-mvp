import { NextRequest } from "next/server";
import { optimizedPages } from "@/lib/seed-data";
import { createApiResponse, createErrorResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const page = optimizedPages.find(p => p.id === id);
  if (!page) {
    return createErrorResponse("NOT_FOUND", "ページが見つかりません。", 404);
  }
  return createApiResponse({ data: page });
}
