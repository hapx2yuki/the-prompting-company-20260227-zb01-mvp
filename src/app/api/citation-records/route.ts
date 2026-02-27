import { NextRequest } from "next/server";
import { citationRecords } from "@/lib/seed-data";
import { paginateAndFilter, createApiResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = paginateAndFilter(
    citationRecords,
    params,
    ["citedProduct", "citationText"],
  );
  return createApiResponse(result);
}
