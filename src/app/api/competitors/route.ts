import { NextRequest } from "next/server";
import { competitors, citationRecords, probingQueries } from "@/lib/seed-data";
import { createApiResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const projectId = params.get("project_id") ?? "proj-001";

  const projectCompetitors = competitors.filter(c => c.projectId === projectId);

  // Self citation data
  const selfCitations = citationRecords.filter(r => r.projectId === projectId && r.isSelfCited);
  const selfQueries = probingQueries.filter(q => q.projectId === projectId);
  const selfCitationRate = selfQueries.length > 0
    ? selfQueries.reduce((sum, q) => sum + q.citationRate, 0) / selfQueries.length
    : 0;

  const comparisonData = [
    {
      name: "自社",
      citationCount: selfCitations.length,
      citationRate: Math.round(selfCitationRate * 100),
      isSelf: true,
    },
    ...projectCompetitors.map(c => ({
      name: c.productName,
      citationCount: c.citationCount,
      citationRate: Math.round(c.citationRate * 100),
      isSelf: false,
    })),
  ];

  return createApiResponse({
    data: {
      competitors: projectCompetitors,
      comparisonData,
    },
  });
}
