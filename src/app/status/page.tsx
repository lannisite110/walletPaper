import type { Metadata } from "next";
import { DiagnosticsPanel } from "@/components/DiagnosticsPanel";
import { collectServerDiagnostics } from "@/lib/diagnostics/collectServerDiagnostics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Status / Diagnostics",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatusPage() {
  const diagnostics = collectServerDiagnostics();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-wide text-[var(--accent)]">Diagnostics</p>
        <h1 className="text-3xl font-semibold text-[var(--text)]">站点状态与异常日志</h1>
        <p className="text-sm text-[var(--muted)]">
          用于部署排查：检查内容是否加载、公开配置是否正常，并汇总本机捕获的前端异常。
          也可直接请求{" "}
          <code className="text-[var(--accent)]">/api/health</code> 获取 JSON。
        </p>
      </header>
      <DiagnosticsPanel initialServer={diagnostics} />
    </main>
  );
}
