export type ThemeStatus = "ready" | "placeholder" | "coming-soon";
export type SourceType = "original" | "curated";
export type ToolCapability = "full" | "placeholder";
export type DeliverableType = "copyConfig" | "download";

export type CopyConfigDeliverable = {
  enabled: boolean;
  format?: string;
  label?: string;
  contentPath?: string;
};

export type DownloadDeliverable = {
  enabled: boolean;
  label?: string;
  filePath?: string;
  fileSize?: string;
};

export type Deliverables = {
  copyConfig: CopyConfigDeliverable;
  download: DownloadDeliverable;
};

export type Attribution = {
  author: string;
  license: string;
  sourceUrl: string | null;
  notes: string | null;
};

export type ApiSlot = {
  owner: string;
  purpose: string;
  status: string;
  note: string;
};

export type Theme = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tool: string;
  status: ThemeStatus;
  sourceType: SourceType;
  tags: string[];
  previewImage: string;
  gallery: string[];
  deliverables: Deliverables;
  attribution: Attribution;
  apiSlot: ApiSlot | null;
  pubDate: string;
  updatedDate: string;
  draft: boolean;
  featured: boolean;
};

export type Tool = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  capability: ToolCapability;
  installPostSlug?: string;
  supportedDeliverables: DeliverableType[];
};
