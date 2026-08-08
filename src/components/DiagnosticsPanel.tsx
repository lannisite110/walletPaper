"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearClientErrors,
  getClientErrors,
  type ClientErrorEntry,
} from "@/components/ClientErrorCapture";
import type { ServerDiagnostics } from "@/lib/diagnostics/collectServerDiagnostics";

type Props = {
  initialServer: ServerDiagnostics;
};

export function DiagnosticsPanel({ initialServer }: Props) {
  const [server, setServer] = useState(initialServer);
  const [liveStatus, setLiveStatus] = useState<"idle" | "loading" | "ok" | "fail">("idle");
  const [clientErrors, setClientErrors] = useState<ClientErrorEntry[]>([]);
  const [copyState, setCopyState] = useState<string>("");

  const refreshClientErrors = useCallback(() => {
    setClientErrors(getClientErrors());
  }, []);

  useEffect(() => {
    refreshClientErrors();
    const onUpdate = () => refreshClientErrors();
    window.addEventListener("wallet-paper-errors-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("wallet-paper-errors-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refreshClientErrors]);

  async function refreshLiveHealth() {
    setLiveStatus("loading");
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = (await res.json()) as ServerDiagnostics;
      setServer(data);
      setLiveStatus(res.ok && data.ok ? "ok" : "fail");
    } catch (error) {
      setLiveStatus("fail");
      setCopyState(
        error instanceof Error ? `Live health failed: ${error.message}` : "Live health failed",
      );
    }
  }

  async function copyReport() {
    const report = {
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      copiedAt: new Date().toISOString(),
      server,
      clientErrors,
    };
    const text = JSON.stringify(report, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("已复制完整诊断 JSON 到剪贴板");
    } catch {
      setCopyState("剪贴板不可用，请手动全选下方文本框复制");
      const el = document.getElementById("diagnostics-raw") as HTMLTextAreaElement | null;
      if (el) {
        el.value = text;
        el.focus();
        el.select();
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void refreshLiveHealth()}
          className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          刷新 /api/health
        </button>
        <button
          type="button"
          onClick={() => void copyReport()}
          className="rounded-md border border-[var(--accent-dim)] bg-[var(--accent-dim)]/30 px-4 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-dim)]/50"
        >
          复制全部诊断信息
        </button>
        <button
          type="button"
          onClick={() => {
            clearClientErrors();
            refreshClientErrors();
            setCopyState("已清空本机前端异常记录");
          }}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)]"
        >
          清空前端异常
        </button>
      </div>

      {copyState ? (
        <p className="text-sm text-[var(--accent)]" role="status">
          {copyState}
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">总览</h2>
        <p className="text-sm text-[var(--muted)]">
          服务端状态：{" "}
          <span className={server.ok ? "text-[var(--accent)]" : "text-[var(--danger)]"}>
            {server.ok ? "OK" : "异常"}
          </span>
          {liveStatus !== "idle" ? (
            <>
              {" "}
              · 实时探测：{liveStatus === "loading" ? "…" : liveStatus.toUpperCase()}
            </>
          ) : null}
        </p>
        <p className="text-xs text-[var(--muted)]">生成时间：{server.generatedAt}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">检查项</h2>
        <ul className="space-y-2">
          {server.checks.map((check) => (
            <li
              key={check.id}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm"
            >
              <span className={check.ok ? "text-[var(--accent)]" : "text-[var(--danger)]"}>
                {check.ok ? "PASS" : "FAIL"}
              </span>
              <span className="ml-2 text-[var(--text)]">{check.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm">
          <h3 className="mb-2 font-medium text-[var(--text)]">运行时</h3>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-[var(--muted)]">
            {JSON.stringify(server.runtime, null, 2)}
          </pre>
        </div>
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm">
          <h3 className="mb-2 font-medium text-[var(--text)]">公开配置</h3>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-[var(--muted)]">
            {JSON.stringify(server.config, null, 2)}
          </pre>
        </div>
        <div className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm sm:col-span-2">
          <h3 className="mb-2 font-medium text-[var(--text)]">内容统计</h3>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-[var(--muted)]">
            {JSON.stringify(server.content, null, 2)}
          </pre>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text)]">
          本机前端异常（localStorage）
        </h2>
        <p className="text-sm text-[var(--muted)]">
          浏览站点时产生的 JS / Promise 异常会记在这里。部署 404
          时若本页都打不开，请到 Vercel → Deployments → Building 复制红色日志。
        </p>
        {clientErrors.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">暂无记录。</p>
        ) : (
          <ul className="space-y-3">
            {clientErrors.map((err) => (
              <li
                key={err.id}
                className="rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-sm"
              >
                <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                  <span>{err.at}</span>
                  <span>{err.type}</span>
                  {err.href ? <span className="break-all">{err.href}</span> : null}
                </div>
                <p className="mt-1 text-[var(--danger)]">{err.message}</p>
                {err.stack ? (
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-[var(--muted)]">
                    {err.stack}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <textarea
        id="diagnostics-raw"
        readOnly
        aria-label="Diagnostics JSON fallback"
        className="h-40 w-full rounded-md border border-[var(--border)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--muted)]"
        defaultValue={JSON.stringify({ server, clientErrors }, null, 2)}
      />
    </div>
  );
}
