import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function paginateAndFilter<T extends Record<string, any>>(
  items: T[],
  searchParams: URLSearchParams,
  searchFields: (keyof T)[] = [],
): { data: T[]; meta: { total: number; page: number; perPage: number; totalPages: number } } {
  let filtered = [...items];

  // Text search (q parameter)
  const q = searchParams.get("q");
  if (q && searchFields.length > 0) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(item =>
      searchFields.some(field => {
        const val = item[field];
        return typeof val === "string" && val.toLowerCase().includes(lower);
      })
    );
  }

  // Dynamic filters (status, industry, ai_model, citation_status, keigo_level)
  for (const [key, value] of searchParams.entries()) {
    if (["q", "page", "per_page", "sort_by", "order"].includes(key)) continue;
    if (value && value !== "all" && value !== "すべて" && value !== "全業種" && value !== "全モデル") {
      filtered = filtered.filter(item => {
        const itemVal = item[key as keyof T];
        if (typeof itemVal === "string") return itemVal === value;
        if (Array.isArray(itemVal)) return itemVal.includes(value);
        return true;
      });
    }
  }

  // Sorting
  const sortBy = searchParams.get("sort_by");
  const order = searchParams.get("order") ?? "desc";
  if (sortBy && sortBy in filtered[0]!) {
    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof T];
      const bVal = b[sortBy as keyof T];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("per_page") ?? "20", 10)));
  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return {
    data: paginated,
    meta: { total, page, perPage, totalPages },
  };
}

export function createApiResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function createErrorResponse(code: string, message: string, status = 400) {
  return NextResponse.json({ error: { code, message } }, { status });
}
