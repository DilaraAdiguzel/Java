import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useApp } from "./app-context";

const schema = z
  .object({
    vendor: z.string().trim().min(2, "Vendor name must be at least 2 characters").max(60),
    category: z.enum(["Infrastructure", "Engineering", "Productivity", "Marketing", "Finance", "Other"], { required_error: "Select a category" }),
    website: z.string().trim().min(1, "Website is required").regex(/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i, "Enter a valid domain, e.g. vendor.com"),
    cost: z.number({ invalid_type_error: "Enter a price" }).positive("Price must be greater than 0").max(1_000_000),
    currency: z.enum(["USD", "EUR", "GBP", "TRY"]),
    billingCycle: z.enum(["Monthly", "Yearly"]),
    firstPayment: z.string().min(1, "First payment date is required"),
    nextRenewal: z.string().min(1, "Next renewal date is required"),
    owner: z.string().trim().min(2, "Owner is required").max(60),
    notes: z.string().max(500, "Notes must be under 500 characters").optional(),
  })
  .refine((d) => !d.firstPayment || !d.nextRenewal || d.nextRenewal >= d.firstPayment, {
    path: ["nextRenewal"],
    message: "Renewal date must be after the first payment",
  });
type FormValues = z.infer<typeof schema>;

const STEPS = [
  { title: "Vendor details", fields: ["vendor", "category", "website"] },
  { title: "Billing", fields: ["cost", "currency", "billingCycle", "firstPayment", "nextRenewal"] },
  { title: "Ownership", fields: ["owner", "notes"] },
] as const;

function Field({ label, error, children, id }: { label: string; error?: string | undefined; children: React.ReactNode; id: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p id={`${id}-err`} className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function AddSubscriptionDrawer() {
  const { addOpen, setAddOpen } = useApp();
  const [step, setStep] = useState(0);
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { vendor: "", website: "", currency: "USD", billingCycle: "Monthly", firstPayment: "", nextRenewal: "", owner: "", notes: "" },
    mode: "onTouched",
  });
  const { register, control, formState: { errors }, trigger, handleSubmit, reset } = form;

  const mutation = useMutation({
    mutationFn: (v: FormValues) => api.createSubscription({ ...v, team: "—", notes: v.notes }),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success(`${s.vendor} added`, { description: "The subscription is now being tracked." });
      close();
    },
    onError: () => toast.error("Couldn't save subscription. Try again."),
  });

  function close() {
    setAddOpen(false);
    setTimeout(() => { reset(); setStep(0); }, 250);
  }

  async function next() {
    const ok = await trigger(STEPS[step]!.fields as unknown as (keyof FormValues)[]);
    if (ok) setStep((s) => s + 1);
  }

  return (
    <Sheet open={addOpen} onOpenChange={(o) => (o ? setAddOpen(true) : close())}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle>Add subscription</SheetTitle>
          <SheetDescription>Track a new recurring expense in three short steps.</SheetDescription>
          <ol className="mt-4 flex items-center gap-2" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-1 items-center gap-2">
                <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold", i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/15 text-primary ring-1 ring-primary" : "bg-muted text-muted-foreground")}>
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={cn("truncate text-xs", i === step ? "font-medium text-foreground" : "text-muted-foreground")}>{s.title}</span>
              </li>
            ))}
          </ol>
        </SheetHeader>

        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-1 flex-col" noValidate>
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            {step === 0 && (
              <>
                <Field id="vendor" label="Vendor name" error={errors.vendor?.message}>
                  <Input id="vendor" placeholder="e.g. Atlassian" aria-invalid={!!errors.vendor} {...register("vendor")} />
                </Field>
                <Field id="category" label="Category" error={errors.category?.message}>
                  <Controller control={control} name="category" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="category" aria-invalid={!!errors.category}><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </Field>
                <Field id="website" label="Website" error={errors.website?.message}>
                  <Input id="website" placeholder="vendor.com" aria-invalid={!!errors.website} {...register("website")} />
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <div className="grid grid-cols-[1fr_110px] gap-3">
                  <Field id="cost" label="Price" error={errors.cost?.message}>
                    <Input id="cost" type="number" step="0.01" placeholder="0.00" aria-invalid={!!errors.cost} {...register("cost", { valueAsNumber: true })} />
                  </Field>
                  <Field id="currency" label="Currency">
                    <Controller control={control} name="currency" render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                        <SelectContent>{["USD", "EUR", "GBP", "TRY"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    )} />
                  </Field>
                </div>
                <Field id="billingCycle" label="Billing cycle">
                  <Controller control={control} name="billingCycle" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="billingCycle"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Yearly">Yearly</SelectItem></SelectContent>
                    </Select>
                  )} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="firstPayment" label="First payment" error={errors.firstPayment?.message}>
                    <Input id="firstPayment" type="date" {...register("firstPayment")} />
                  </Field>
                  <Field id="nextRenewal" label="Next renewal" error={errors.nextRenewal?.message}>
                    <Input id="nextRenewal" type="date" {...register("nextRenewal")} />
                  </Field>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <Field id="owner" label="Owner / team" error={errors.owner?.message}>
                  <Input id="owner" placeholder="e.g. Mert Kaya — Platform" {...register("owner")} />
                </Field>
                <Field id="notes" label="Notes (optional)" error={errors.notes?.message}>
                  <Textarea id="notes" rows={4} placeholder="Contract terms, cancellation policy…" {...register("notes")} />
                </Field>
              </>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border p-4">
            <Button type="button" variant="ghost" onClick={() => (step === 0 ? close() : setStep((s) => s - 1))}>
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next}>Continue</Button>
            ) : (
              <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving…" : "Save subscription"}</Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
