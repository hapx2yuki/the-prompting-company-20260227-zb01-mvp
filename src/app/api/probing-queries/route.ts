import { NextRequest } from "next/server";
import { probingQueries } from "@/lib/seed-data";
import { paginateAndFilter, createApiResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = paginateAndFilter(
    probingQueries.filter(q => !q.isHidden),
    params,
    ["queryText"],
  );
  return createApiResponse(result);
}
