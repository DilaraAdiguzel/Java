import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useApp } from "./app-context";

export function ImportCsvDialog() {
  const { importOpen, setImportOpen } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!file) return;
    setBusy(true);
    await api.importCsv(file);
    setBusy(false);
    setImportOpen(false);
    setFile(null);
    toast.success("CSV uploaded", { description: `${file.name} is being processed. Matches will appear shortly.` });
  }

  return (
    <Dialog open={importOpen} onOpenChange={setImportOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>Upload a bank or card export. We'll detect recurring payments automatically.</DialogDescription>
        </DialogHeader>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-muted/40 px-6 py-10 text-center transition-colors hover:border-primary/60 focus-within:ring-2 focus-within:ring-ring">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{file ? file.name : "Choose a .csv file"}</span>
          <span className="text-xs text-muted-foreground">Columns: date, description, amount, currency</span>
          <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <DialogFooter>
          <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
          <Button disabled={!file || busy} onClick={submit}>{busy ? "Uploading…" : "Import"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
