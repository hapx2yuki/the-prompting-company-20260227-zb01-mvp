import type {
  Organization, User, Project, ProbingQuery, CitationRecord,
  OptimizedPage, TrafficEvent, AIModel, Industry, KeigoLevel,
  Competitor, ActivityEvent,
  AIModelName, CitationStatus, KeigoLevelId, PageStatus,
  ConversionStatus
} from "@/types/models";

// SD-08: AIModel master data (5 records)
export const aiModels: AIModel[] = [
  { name: "chatgpt", displayName: "ChatGPT", isActive: true },
  { name: "gemini", displayName: "Gemini", isActive: true },
  { name: "claude", displayName: "Claude", isActive: true },
  { name: "perplexity", displayName: "Perplexity", isActive: true },
  { name: "copilot", displayName: "Copilot", isActive: true },
];

// SD-09: Industry master data (12 records)
export const industries: Industry[] = [
  { code: "saas", nameJa: "SaaS", nameEn: "SaaS", keigoDefault: "teinei" },
  { code: "fintech", nameJa: "フィンテック", nameEn: "Fintech", keigoDefault: "sonkei" },
  { code: "ec", nameJa: "EC", nameEn: "E-Commerce", keigoDefault: "teinei" },
  { code: "manufacturing", nameJa: "製造業", nameEn: "Manufacturing", keigoDefault: "teinei" },
  { code: "real_estate", nameJa: "不動産", nameEn: "Real Estate", keigoDefault: "sonkei" },
  { code: "education", nameJa: "教育", nameEn: "Education", keigoDefault: "teinei" },
  { code: "healthcare", nameJa: "医療", nameEn: "Healthcare", keigoDefault: "sonkei" },
  { code: "logistics", nameJa: "物流", nameEn: "Logistics", keigoDefault: "teinei" },
  { code: "hr", nameJa: "HR", nameEn: "Human Resources", keigoDefault: "teinei" },
  { code: "legal", nameJa: "法務", nameEn: "Legal", keigoDefault: "sonkei" },
  { code: "accounting", nameJa: "会計", nameEn: "Accounting", keigoDefault: "sonkei" },
  { code: "marketing", nameJa: "マーケティング", nameEn: "Marketing", keigoDefault: "teinei" },
];

// SD-10: KeigoLevel master data (3 records)
export const keigoLevels: KeigoLevel[] = [
  {
    id: "teinei",
    level: "丁寧語",
    description: "一般的なビジネスコミュニケーションに使用。「です」「ます」調。SaaS、EC、製造業、教育、物流、HR、マーケティング向け。",
    usageGuideline: "標準的なビジネス文書、ブログ記事、製品説明ページに使用",
  },
  {
    id: "sonkei",
    level: "尊敬語",
    description: "顧客やパートナー企業への敬意を表す表現。金融、不動産、医療、法務、会計業界向け。",
    usageGuideline: "金融機関向け提案資料、医療機関向け製品紹介、法務関連の正式文書に使用",
  },
  {
    id: "kenjou",
    level: "謙譲語",
    description: "自社の行動を謙虚に表現。自社製品・サービスの紹介文、企業案内、プレスリリース向け。",
    usageGuideline: "自社サービスの紹介ページ、プレスリリース、企業概要ページに使用",
  },
];

// SD-01: Organization (2 records)
export const organizations: Organization[] = [
  { id: "org-001", name: "株式会社テックナビ", domain: "technavi.co.jp", industry: "saas", plan: "business", createdAt: "2026-01-10T09:00:00+09:00" },
  { id: "org-002", name: "合同会社AIリサーチ", domain: "airesearch.jp", industry: "fintech", plan: "starter", createdAt: "2026-01-20T10:00:00+09:00" },
];

// SD-02: User (5 records)
export const users: User[] = [
  { id: "user-001", organizationId: "org-001", name: "田中 太郎", email: "tanaka@technavi.co.jp", role: "admin", lastLoginAt: "2026-02-27T08:30:00+09:00", createdAt: "2026-01-10T09:00:00+09:00" },
  { id: "user-002", organizationId: "org-001", name: "佐藤 花子", email: "sato@technavi.co.jp", role: "editor", lastLoginAt: "2026-02-26T14:00:00+09:00", createdAt: "2026-01-12T10:00:00+09:00" },
  { id: "user-003", organizationId: "org-001", name: "鈴木 一郎", email: "suzuki@technavi.co.jp", role: "viewer", lastLoginAt: "2026-02-25T16:30:00+09:00", createdAt: "2026-01-15T11:00:00+09:00" },
  { id: "user-004", organizationId: "org-002", name: "高橋 美咲", email: "takahashi@airesearch.jp", role: "admin", lastLoginAt: "2026-02-27T09:00:00+09:00", createdAt: "2026-01-20T10:00:00+09:00" },
  { id: "user-005", organizationId: "org-002", name: "渡辺 健太", email: "watanabe@airesearch.jp", role: "editor", lastLoginAt: "2026-02-24T11:00:00+09:00", createdAt: "2026-01-22T09:30:00+09:00" },
];

// SD-03: Project (3 records)
export const projects: Project[] = [
  { id: "proj-001", organizationId: "org-001", name: "テックナビ CRM", domain: "crm.technavi.co.jp", productName: "テックナビCRM", industry: "saas", autoProbing: true, probingFrequency: "daily", emailNotifications: true, createdAt: "2026-01-15T10:00:00+09:00", updatedAt: "2026-02-26T18:00:00+09:00" },
  { id: "proj-002", organizationId: "org-002", name: "AIリサーチ Analytics", domain: "analytics.airesearch.jp", productName: "AIリサーチアナリティクス", industry: "fintech", autoProbing: true, probingFrequency: "weekly", emailNotifications: true, createdAt: "2026-01-25T10:00:00+09:00", updatedAt: "2026-02-25T15:00:00+09:00" },
  { id: "proj-003", organizationId: "org-001", name: "テックナビ HR", domain: "hr.technavi.co.jp", productName: "テックナビHR", industry: "hr", autoProbing: false, probingFrequency: "monthly", emailNotifications: false, createdAt: "2026-02-01T10:00:00+09:00", updatedAt: "2026-02-20T12:00:00+09:00" },
];

// Helper: generate dates spread over the last 90 days
function daysAgo(n: number): string {
  const d = new Date("2026-02-27T12:00:00+09:00");
  d.setDate(d.getDate() - n);
  d.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));
  return d.toISOString();
}

// SD-04: ProbingQuery (30 records)
const queryTemplates: Array<{ text: string; industry: string; status: CitationStatus; rate: number; models: AIModelName[] }> = [
  { text: "CRMツール おすすめ 中小企業 2026年", industry: "saas", status: "cited", rate: 0.75, models: ["chatgpt", "gemini", "claude"] },
  { text: "クラウド会計ソフト 比較 freee マネーフォワード", industry: "fintech", status: "not_cited", rate: 0.0, models: ["chatgpt", "gemini"] },
  { text: "人事管理システム 選び方 従業員100名", industry: "hr", status: "partial", rate: 0.33, models: ["chatgpt", "claude", "perplexity"] },
  { text: "マーケティングオートメーション 日本語対応", industry: "marketing", status: "cited", rate: 0.67, models: ["chatgpt", "gemini", "claude"] },
  { text: "不動産管理システム クラウド おすすめ", industry: "real_estate", status: "not_cited", rate: 0.0, models: ["chatgpt", "gemini"] },
  { text: "ECサイト構築 おすすめ プラットフォーム", industry: "ec", status: "cited", rate: 0.80, models: ["chatgpt", "gemini", "claude", "perplexity"] },
  { text: "製造業DX 生産管理システム 比較", industry: "manufacturing", status: "partial", rate: 0.25, models: ["chatgpt", "gemini"] },
  { text: "教育向けLMS 導入 大学", industry: "education", status: "cited", rate: 0.50, models: ["chatgpt", "claude"] },
  { text: "遠隔医療プラットフォーム 導入事例", industry: "healthcare", status: "not_cited", rate: 0.0, models: ["chatgpt", "gemini", "copilot"] },
  { text: "物流管理システム WMS おすすめ 中規模", industry: "logistics", status: "partial", rate: 0.40, models: ["chatgpt", "gemini", "claude"] },
  { text: "法務DX リーガルテック 契約管理", industry: "legal", status: "cited", rate: 0.60, models: ["chatgpt", "claude", "perplexity"] },
  { text: "会計ソフト クラウド 個人事業主", industry: "accounting", status: "cited", rate: 0.85, models: ["chatgpt", "gemini", "claude", "perplexity"] },
  { text: "SaaS顧客管理 無料トライアル 日本語", industry: "saas", status: "cited", rate: 0.70, models: ["chatgpt", "gemini", "claude"] },
  { text: "フィンテック API連携 決済サービス", industry: "fintech", status: "partial", rate: 0.33, models: ["chatgpt", "gemini"] },
  { text: "採用管理ツール ATS おすすめ 2026", industry: "hr", status: "not_cited", rate: 0.0, models: ["chatgpt", "copilot"] },
  { text: "SNSマーケティング 自動投稿 ツール", industry: "marketing", status: "cited", rate: 0.55, models: ["chatgpt", "gemini", "perplexity"] },
  { text: "不動産仲介 業務効率化 システム", industry: "real_estate", status: "partial", rate: 0.20, models: ["chatgpt", "gemini", "claude"] },
  { text: "ECサイト カート落ち対策 AI活用", industry: "ec", status: "cited", rate: 0.90, models: ["chatgpt", "gemini", "claude", "perplexity"] },
  { text: "工場IoT センサー管理 クラウド", industry: "manufacturing", status: "not_cited", rate: 0.0, models: ["chatgpt", "gemini"] },
  { text: "オンライン学習 プラットフォーム 企業研修", industry: "education", status: "cited", rate: 0.45, models: ["chatgpt", "claude"] },
  { text: "電子カルテ クラウド 診療所向け", industry: "healthcare", status: "partial", rate: 0.30, models: ["chatgpt", "gemini", "claude"] },
  { text: "配送ルート最適化 AI 運送会社", industry: "logistics", status: "cited", rate: 0.65, models: ["chatgpt", "gemini", "claude", "perplexity"] },
  { text: "電子契約 クラウドサイン 比較 2026", industry: "legal", status: "cited", rate: 0.72, models: ["chatgpt", "gemini", "claude"] },
  { text: "請求書発行 クラウド 自動化", industry: "accounting", status: "partial", rate: 0.38, models: ["chatgpt", "gemini"] },
  { text: "SaaS営業支援 セールスフォース 代替", industry: "saas", status: "cited", rate: 0.82, models: ["chatgpt", "gemini", "claude", "copilot"] },
  { text: "ロボアドバイザー 比較 日本 2026", industry: "fintech", status: "not_cited", rate: 0.0, models: ["chatgpt", "perplexity"] },
  { text: "勤怠管理 クラウド 中小企業 コスパ", industry: "hr", status: "cited", rate: 0.58, models: ["chatgpt", "gemini", "claude"] },
  { text: "メールマーケティング 日本語 配信ツール", industry: "marketing", status: "partial", rate: 0.42, models: ["chatgpt", "gemini"] },
  { text: "BtoB ECサイト 受発注システム", industry: "ec", status: "cited", rate: 0.77, models: ["chatgpt", "gemini", "claude", "perplexity"] },
  { text: "品質管理 QMS クラウド 製造業", industry: "manufacturing", status: "partial", rate: 0.28, models: ["chatgpt", "claude"] },
];

export const probingQueries: ProbingQuery[] = queryTemplates.map((t, i) => ({
  id: `pq-${String(i + 1).padStart(3, "0")}`,
  projectId: i < 15 ? "proj-001" : i < 25 ? "proj-002" : "proj-003",
  queryText: t.text,
  industry: t.industry,
  citationStatus: t.status,
  citationRate: t.rate,
  aiModels: t.models,
  discoveredAt: daysAgo(85 - i * 2),
  lastProbedAt: daysAgo(Math.max(0, 30 - i)),
  isHidden: false,
}));

// SD-05: CitationRecord (90 records)
const citationTexts: Record<string, string[]> = {
  chatgpt: [
    "テックナビCRMは中小企業向けのクラウドCRMソリューションとして、日本語完全対応の顧客管理機能を提供しています。",
    "テックナビCRMは、営業パイプライン管理と顧客コミュニケーション追跡において高い評価を得ています。",
    "日本の中小企業向けCRMとしては、テックナビCRMが使いやすさと価格のバランスで推奨されています。",
  ],
  gemini: [
    "日本の中小企業向けCRMとしては、Salesforce EssentialsやHubSpot CRMが一般的に推奨されています。",
    "クラウドCRMの選択肢として、テックナビCRMは日本語サポートの手厚さで注目されています。",
    "テックナビCRMは、日本市場に特化したCRMプラットフォームの一つとして紹介されることがあります。",
  ],
  claude: [
    "テックナビCRMは、日本市場に特化したCRMツールの一つとして知られています。",
    "中小企業のCRM導入において、テックナビCRMは導入の容易さとカスタマーサポートの質で差別化されています。",
    "テックナビCRMは、日本語UI、円建て請求、国内データセンターを特徴とするCRMソリューションです。",
  ],
  perplexity: [
    "テックナビCRMは、日本市場向けに設計されたクラウドベースの顧客関係管理ツールです。",
    "中小企業のデジタル変革において、テックナビCRMのようなSaaSプロダクトが注目を集めています。",
  ],
  copilot: [
    "テックナビCRMは、Microsoft 365との連携が可能な日本語CRMツールです。",
  ],
};

export const citationRecords: CitationRecord[] = [];
let crId = 1;
for (let dayOffset = 0; dayOffset < 90; dayOffset += 1) {
  if (dayOffset % 1 === 0 && crId <= 90) {
    const models: AIModelName[] = ["chatgpt", "gemini", "claude", "perplexity"];
    const model = models[dayOffset % models.length];
    const texts = citationTexts[model];
    const isSelf = dayOffset % 3 !== 2;
    citationRecords.push({
      id: `cr-${String(crId).padStart(3, "0")}`,
      probingQueryId: `pq-${String((dayOffset % 30) + 1).padStart(3, "0")}`,
      projectId: dayOffset < 60 ? "proj-001" : "proj-002",
      aiModel: model,
      citedProduct: isSelf ? "テックナビCRM" : ["競合A CRM", "競合B CRM", "HubSpot CRM"][dayOffset % 3],
      citationText: texts[dayOffset % texts.length],
      citationRank: (dayOffset % 5) + 1,
      isSelfCited: isSelf,
      timestamp: daysAgo(dayOffset),
    });
    crId++;
  }
}

// SD-06: OptimizedPage (15 records)
const pageTemplates: Array<{ title: string; keigo: KeigoLevelId; industry: string; status: PageStatus }> = [
  { title: "中小企業向けCRMツールの選び方ガイド", keigo: "teinei", industry: "saas", status: "published" },
  { title: "クラウド会計ソフト徹底比較2026年版", keigo: "teinei", industry: "fintech", status: "published" },
  { title: "金融機関向けAI活用プラットフォームのご紹介", keigo: "sonkei", industry: "fintech", status: "published" },
  { title: "人事管理システム導入のポイント", keigo: "teinei", industry: "hr", status: "draft" },
  { title: "弊社マーケティングオートメーションの特長", keigo: "kenjou", industry: "marketing", status: "published" },
  { title: "ECサイト構築完全ガイド：プラットフォーム比較", keigo: "teinei", industry: "ec", status: "published" },
  { title: "製造業DXの第一歩：生産管理システム導入ガイド", keigo: "teinei", industry: "manufacturing", status: "published" },
  { title: "オンライン教育プラットフォームの活用方法", keigo: "teinei", industry: "education", status: "draft" },
  { title: "御社の医療DXを支援する遠隔医療ソリューション", keigo: "sonkei", industry: "healthcare", status: "published" },
  { title: "物流業界のAI活用：配送ルート最適化の実践", keigo: "teinei", industry: "logistics", status: "published" },
  { title: "弊社リーガルテックサービスのご案内", keigo: "kenjou", industry: "legal", status: "published" },
  { title: "クラウド会計で実現する経理業務の自動化", keigo: "teinei", industry: "accounting", status: "archived" },
  { title: "SaaS営業支援ツールの導入効果レポート", keigo: "teinei", industry: "saas", status: "published" },
  { title: "不動産管理のデジタル化：クラウドシステム導入事例", keigo: "sonkei", industry: "real_estate", status: "draft" },
  { title: "弊社採用管理システムによる採用コスト削減事例", keigo: "kenjou", industry: "hr", status: "published" },
];

export const optimizedPages: OptimizedPage[] = pageTemplates.map((t, i) => ({
  id: `page-${String(i + 1).padStart(3, "0")}`,
  projectId: i < 8 ? "proj-001" : i < 12 ? "proj-002" : "proj-003",
  title: t.title,
  markdownContent: `# ${t.title}\n\n## はじめに\n\nこのページは、${t.industry === "saas" ? "SaaS" : industries.find(ind => ind.code === t.industry)?.nameJa ?? t.industry}業界向けに最適化されたLLMコンテンツです。\n\n## 概要\n\n${t.title}に関する詳細な情報を提供します。日本市場に特化したソリューションとして、導入から運用まで包括的にサポートいたします。\n\n## 特長\n\n- 日本語完全対応\n- 円建て料金プラン\n- 国内データセンターでのホスティング\n- 24時間365日の日本語カスタマーサポート\n\n## 導入事例\n\n多くの日本企業にご導入いただいております。具体的な導入事例については、お問い合わせください。`,
  keigoLevel: t.keigo,
  industry: t.industry,
  status: t.status,
  citationCount: Math.floor(Math.random() * 50) + (t.status === "published" ? 10 : 0),
  trafficCount: Math.floor(Math.random() * 200) + (t.status === "published" ? 30 : 0),
  url: `https://${i < 8 ? "crm.technavi.co.jp" : i < 12 ? "analytics.airesearch.jp" : "hr.technavi.co.jp"}/pages/${String(i + 1).padStart(3, "0")}`,
  createdAt: daysAgo(80 - i * 4),
  updatedAt: daysAgo(Math.max(0, 20 - i * 2)),
}));

// SD-07: TrafficEvent (500 records)
const aiModelDistribution: AIModelName[] = [];
for (let i = 0; i < 50; i++) aiModelDistribution.push("chatgpt"); // 50%
for (let i = 0; i < 25; i++) aiModelDistribution.push("gemini"); // 25%
for (let i = 0; i < 15; i++) aiModelDistribution.push("claude"); // 15%
for (let i = 0; i < 10; i++) aiModelDistribution.push("perplexity"); // 10%

const referrerUrls: Record<AIModelName, string> = {
  chatgpt: "https://chat.openai.com/",
  gemini: "https://gemini.google.com/",
  claude: "https://claude.ai/",
  perplexity: "https://www.perplexity.ai/",
  copilot: "https://copilot.microsoft.com/",
};

export const trafficEvents: TrafficEvent[] = Array.from({ length: 500 }, (_, i) => {
  const model = aiModelDistribution[i % aiModelDistribution.length];
  const isConverted = i % 7 === 0; // ~14.2% CVR
  const pageIndex = i % 15;
  return {
    id: `te-${String(i + 1).padStart(4, "0")}`,
    projectId: pageIndex < 8 ? "proj-001" : pageIndex < 12 ? "proj-002" : "proj-003",
    optimizedPageId: `page-${String(pageIndex + 1).padStart(3, "0")}`,
    sourceAIModel: model,
    referrerUrl: referrerUrls[model],
    conversionStatus: (isConverted ? "converted" : "not_converted") as ConversionStatus,
    revenueJPY: isConverted ? 5000 + Math.floor(Math.random() * 45000) : 0,
    timestamp: daysAgo(Math.floor(i * 90 / 500)),
  };
});

// Competitor data
export const competitors: Competitor[] = [
  { id: "comp-001", projectId: "proj-001", productName: "競合A CRM", domain: "competitor-a.co.jp", citationCount: 45, citationRate: 0.62, addedAt: "2026-01-20T10:00:00+09:00", lastAnalyzedAt: "2026-02-27T08:00:00+09:00" },
  { id: "comp-002", projectId: "proj-001", productName: "HubSpot CRM", domain: "hubspot.jp", citationCount: 78, citationRate: 0.85, addedAt: "2026-01-20T10:00:00+09:00", lastAnalyzedAt: "2026-02-27T08:00:00+09:00" },
  { id: "comp-003", projectId: "proj-001", productName: "Salesforce", domain: "salesforce.com", citationCount: 92, citationRate: 0.91, addedAt: "2026-01-20T10:00:00+09:00", lastAnalyzedAt: "2026-02-27T08:00:00+09:00" },
];

// Activity events
export const activityEvents: ActivityEvent[] = [
  { id: "act-001", projectId: "proj-001", type: "citation_detected", content: "新しい引用を検出: 「CRMツール おすすめ 中小企業 2026年」 - ChatGPT", timestamp: "2026-02-27T10:30:00+09:00" },
  { id: "act-002", projectId: "proj-001", type: "page_published", content: "ページを公開: 「中小企業向けCRMツールの選び方ガイド」", timestamp: "2026-02-27T09:15:00+09:00" },
  { id: "act-003", projectId: "proj-001", type: "probing_completed", content: "プロービング完了: 5件の新規クエリ発見", timestamp: "2026-02-27T08:00:00+09:00" },
  { id: "act-004", projectId: "proj-001", type: "citation_detected", content: "新しい引用を検出: 「SaaS営業支援 セールスフォース 代替」 - Claude", timestamp: "2026-02-26T16:45:00+09:00" },
  { id: "act-005", projectId: "proj-001", type: "traffic_alert", content: "AIトラフィック急増: ChatGPT経由のアクセスが前日比+45%", timestamp: "2026-02-26T14:00:00+09:00" },
];

// Dashboard KPI calculations
export function calculateDashboardKPIs(projectId: string) {
  const projectQueries = probingQueries.filter(q => q.projectId === projectId);
  const projectTraffic = trafficEvents.filter(t => t.projectId === projectId);
  const recentTraffic = projectTraffic.filter(t => {
    const d = new Date(t.timestamp);
    const sevenDaysAgo = new Date("2026-02-20T00:00:00+09:00");
    return d >= sevenDaysAgo;
  });

  const avgCitationRate = projectQueries.length > 0
    ? projectQueries.reduce((sum, q) => sum + q.citationRate, 0) / projectQueries.length
    : 0;

  const citedQueries = projectQueries.filter(q => q.citationStatus === "cited").length;
  const coverageRate = projectQueries.length > 0 ? citedQueries / projectQueries.length : 0;

  const convertedTraffic = recentTraffic.filter(t => t.conversionStatus === "converted");
  const estimatedROI = convertedTraffic.reduce((sum, t) => sum + t.revenueJPY, 0);

  return {
    citationRate: Math.round(avgCitationRate * 100),
    citationRateDelta: 5.2,
    aiTrafficCount: recentTraffic.length,
    aiTrafficDelta: 12.3,
    coverageRate: Math.round(coverageRate * 100),
    estimatedROI,
    estimatedROIDelta: 8.5,
  };
}

// Chart data generators
export function generateCitationTrendData(projectId: string, days: number = 30) {
  const data: Array<{ date: string; chatgpt: number; gemini: number; claude: number; perplexity: number }> = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date("2026-02-27T00:00:00+09:00");
    d.setDate(d.getDate() - i);
    const dateStr = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
    data.push({
      date: dateStr,
      chatgpt: 55 + Math.floor(Math.random() * 30),
      gemini: 40 + Math.floor(Math.random() * 25),
      claude: 35 + Math.floor(Math.random() * 20),
      perplexity: 25 + Math.floor(Math.random() * 20),
    });
  }
  return data;
}

export function generateAIModelCitationData(projectId: string) {
  const records = citationRecords.filter(r => r.projectId === projectId && r.isSelfCited);
  const byModel: Record<string, number> = {};
  for (const r of records) {
    byModel[r.aiModel] = (byModel[r.aiModel] || 0) + 1;
  }
  return aiModels.map(m => ({
    name: m.displayName,
    value: byModel[m.name] || 0,
  }));
}

export function generateTrafficTrendData(projectId: string, days: number = 30) {
  const data: Array<{ date: string; chatgpt: number; gemini: number; claude: number; perplexity: number }> = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date("2026-02-27T00:00:00+09:00");
    d.setDate(d.getDate() - i);
    const dateStr = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
    data.push({
      date: dateStr,
      chatgpt: 8 + Math.floor(Math.random() * 12),
      gemini: 4 + Math.floor(Math.random() * 8),
      claude: 2 + Math.floor(Math.random() * 5),
      perplexity: 1 + Math.floor(Math.random() * 4),
    });
  }
  return data;
}

export function generateTrafficModelShareData(projectId: string) {
  const events = trafficEvents.filter(t => t.projectId === projectId);
  const byModel: Record<string, number> = {};
  for (const e of events) {
    byModel[e.sourceAIModel] = (byModel[e.sourceAIModel] || 0) + 1;
  }
  return aiModels.map(m => ({
    name: m.displayName,
    value: byModel[m.name] || 0,
  }));
}
