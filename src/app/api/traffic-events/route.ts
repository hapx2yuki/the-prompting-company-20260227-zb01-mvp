import { NextRequest } from "next/server";
import {
  trafficEvents,
  generateTrafficTrendData,
  generateTrafficModelShareData,
} from "@/lib/seed-data";
import { createApiResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const projectId = params.get("project_id") ?? "proj-001";
  const period = parseInt(params.get("period") ?? "30", 10);

  const projectEvents = trafficEvents.filter(t => t.projectId === projectId);
  const total = projectEvents.length;
  const converted = projectEvents.filter(t => t.conversionStatus === "converted");
  const totalRevenue = converted.reduce((sum, t) => sum + t.revenueJPY, 0);

  return createApiResponse({
    data: {
      kpis: {
        totalTraffic: total,
        totalTrafficDelta: 12.3,
        conversions: converted.length,
        conversionsDelta: 8.7,
        conversionRate: total > 0 ? Math.round((converted.length / total) * 1000) / 10 : 0,
        conversionRateDelta: 1.2,
        estimatedROI: totalRevenue,
        estimatedROIDelta: 15.4,
      },
      trendData: generateTrafficTrendData(projectId, period),
      modelShareData: generateTrafficModelShareData(projectId),
    },
  });
}
