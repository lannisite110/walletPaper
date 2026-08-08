import { NextResponse } from "next/server";
import { collectServerDiagnostics } from "@/lib/diagnostics/collectServerDiagnostics";

export const dynamic = "force-dynamic";

export function GET() {
  const diagnostics = collectServerDiagnostics();
  return NextResponse.json(diagnostics, {
    status: diagnostics.ok ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
