import { NextRequest } from "next/server";
import {
  calculateDashboardKPIs,
  generateCitationTrendData,
  generateAIModelCitationData,
  generateTrafficTrendData,
  activityEvents,
  probingQueries,
} from "@/lib/seed-data";
import { createApiResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const projectId = params.get("project_id") ?? "proj-001";
  const period = parseInt(params.get("period") ?? "30", 10);

  const kpis = calculateDashboardKPIs(projectId);
  const citationTrend = generateCitationTrendData(projectId, period);
  const aiModelCitations = generateAIModelCitationData(projectId);
  const trafficTrend = generateTrafficTrendData(projectId, period);
  const activities = activityEvents.filter(a => a.projectId === projectId).slice(0, 5);
  const topQueries = probingQueries
    .filter(q => q.projectId === projectId && q.citationStatus === "cited")
    .sort((a, b) => b.citationRate - a.citationRate)
    .slice(0, 5);

  return createApiResponse({
    data: {
      kpis,
      citationTrend,
      aiModelCitations,
      trafficTrend,
      activities,
      topQueries,
    },
  });
}
