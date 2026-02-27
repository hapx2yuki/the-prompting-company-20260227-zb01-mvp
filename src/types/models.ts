export type CitationStatus = "cited" | "not_cited" | "partial";
export type PageStatus = "draft" | "published" | "archived";
export type KeigoLevelId = "teinei" | "sonkei" | "kenjou";
export type UserRole = "admin" | "editor" | "viewer";
export type PlanType = "starter" | "business" | "enterprise";
export type ConversionStatus = "converted" | "not_converted";
export type AIModelName = "chatgpt" | "gemini" | "claude" | "perplexity" | "copilot";

export interface Organization {
  id: string;
  name: string;
  domain: string;
  industry: string;
  plan: PlanType;
  createdAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  lastLoginAt: string;
  createdAt: string;
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  domain: string;
  productName: string;
  industry: string;
  autoProbing: boolean;
  probingFrequency: "daily" | "weekly" | "monthly";
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProbingQuery {
  id: string;
  projectId: string;
  queryText: string;
  industry: string;
  citationStatus: CitationStatus;
  citationRate: number;
  aiModels: AIModelName[];
  discoveredAt: string;
  lastProbedAt: string;
  isHidden: boolean;
}

export interface CitationRecord {
  id: string;
  probingQueryId: string;
  projectId: string;
  aiModel: AIModelName;
  citedProduct: string;
  citationText: string;
  citationRank: number;
  isSelfCited: boolean;
  timestamp: string;
}

export interface OptimizedPage {
  id: string;
  projectId: string;
  title: string;
  markdownContent: string;
  keigoLevel: KeigoLevelId;
  industry: string;
  status: PageStatus;
  citationCount: number;
  trafficCount: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrafficEvent {
  id: string;
  projectId: string;
  optimizedPageId: string;
  sourceAIModel: AIModelName;
  referrerUrl: string;
  conversionStatus: ConversionStatus;
  revenueJPY: number;
  timestamp: string;
}

export interface AIModel {
  name: AIModelName;
  displayName: string;
  isActive: boolean;
}

export interface Industry {
  code: string;
  nameJa: string;
  nameEn: string;
  keigoDefault: KeigoLevelId;
}

export interface KeigoLevel {
  id: KeigoLevelId;
  level: string;
  description: string;
  usageGuideline: string;
}

export interface Competitor {
  id: string;
  projectId: string;
  productName: string;
  domain: string;
  citationCount: number;
  citationRate: number;
  addedAt: string;
  lastAnalyzedAt: string;
}

export interface ActivityEvent {
  id: string;
  projectId: string;
  type: "citation_detected" | "page_published" | "probing_completed" | "traffic_alert";
  content: string;
  timestamp: string;
}

// API response types
export interface ApiListResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface ApiDetailResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
