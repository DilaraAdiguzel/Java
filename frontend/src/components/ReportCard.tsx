import { Download, FileSpreadsheet, FileText, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Report } from "@/lib/types";
import { Card, Pill } from "./common";

export function ReportCard({ report }: { report: Report }) {
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");
  const [generated, setGenerated] = useState(report.lastGenerated);
  const Icon = report.format === "PDF" ? FileText : FileSpreadsheet;

  function generate() {
    setState("loading");
    setTimeout(() => {
      setState("ready");
      setGenerated("Just now");
      toast.success(`${report.title} is ready`, { description: `Your ${report.format} file can be downloaded.` });
    }, 1600);
  }

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-muted text-muted-foreground"><Icon className="h-4 w-4" /></span>
        <Pill tone={report.format === "PDF" ? "danger" : "success"}>{report.format}</Pill>
      </div>
      <h3 className="mt-4 text-sm font-semibold">{report.title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{report.description}</p>
      <p className="mt-4 text-xs text-muted-foreground">Last generated: <span className="text-foreground">{generated}</span></p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={generate} disabled={state === "loading"}>
          {state === "loading" ? <><Loader2 className="animate-spin" /> Generating…</> : <><Sparkles /> Generate</>}
        </Button>
        {state === "ready" && (
          <Button size="sm" onClick={() => toast("Download started", { description: `${report.title}.${report.format === "PDF" ? "pdf" : "xlsx"}` })}>
            <Download /> Download
          </Button>
        )}
      </div>
    </Card>
  );
}
