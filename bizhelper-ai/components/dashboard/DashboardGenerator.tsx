"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import Generator from "@/components/Generator";
import UsageMeter from "./UsageMeter";
import type { GenerateResponse } from "@/lib/generateContent";

type RecentItem = GenerateResponse & { at: number };

export default function DashboardGenerator({
  initialUsed,
  limit,
}: {
  initialUsed: number;
  limit: number | null;
}) {
  const [used, setUsed] = useState(initialUsed);
  const [recent, setRecent] = useState<RecentItem[]>([]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_18rem]">
      <div className="space-y-6">
        <div className="glass rounded-3xl p-5 sm:p-6">
          <UsageMeter used={used} limit={limit} />
        </div>

        <Generator
          upgradeHref="/dashboard/billing"
          onUsage={(u) => setUsed(u.used)}
          onResult={(r) =>
            setRecent((prev) => [{ ...r, at: Date.now() }, ...prev].slice(0, 5))
          }
        />
      </div>

      {/* Recent generations */}
      <aside className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
          Recent content
        </p>
        {recent.length === 0 ? (
          <div className="glass rounded-2xl p-5 text-center text-sm text-ink-muted">
            <FileText size={20} className="mx-auto mb-2 text-ink-faint" />
            Your generated content will show up here.
          </div>
        ) : (
          recent.map((item, i) => (
            <div key={item.at + "-" + i} className="glass rounded-2xl p-4">
              <p className="mb-1 text-[11px] uppercase tracking-wider text-brand-violet">
                {item.meta}
              </p>
              <p className="line-clamp-3 whitespace-pre-wrap text-xs leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))
        )}
      </aside>
    </div>
  );
}
