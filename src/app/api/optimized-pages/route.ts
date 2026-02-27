import { NextRequest } from "next/server";
import { optimizedPages } from "@/lib/seed-data";
import { paginateAndFilter, createApiResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = paginateAndFilter(
    optimizedPages,
    params,
    ["title", "url"],
  );
  return createApiResponse(result);
}
