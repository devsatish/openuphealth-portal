"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Download, ArrowUpRight } from "lucide-react";

const mockInvoices = [
  { id: "inv1", date: "2026-03-01", amount: 2450, status: "paid", description: "Professional Plan — March 2026" },
  { id: "inv2", date: "2026-02-01", amount: 2450, status: "paid", description: "Professional Plan — February 2026" },
  { id: "inv3", date: "2026-01-01", amount: 2450, status: "paid", description: "Professional Plan — January 2026" },
  { id: "inv4", date: "2025-12-01", amount: 2450, status: "paid", description: "Professional Plan — December 2025" },
];

export default function OrgBillingPage() {
  const [invoices, setInvoices] = useState<typeof mockInvoices>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/billing/invoices");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setInvoices(data); return; }
        }
      } catch { /* fallback */ }
      finally { setInvoices(mockInvoices); setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your organization's subscription and invoices</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-foreground">Professional Plan</h2>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">50 seats · $49/seat/month · Billed monthly</p>
              <p className="text-sm text-muted-foreground mt-1">Next renewal: <strong className="text-foreground">April 1, 2026</strong></p>
            </div>
            <Button className="gap-1 flex-shrink-0">
              <ArrowUpRight className="size-4" /> Upgrade
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-primary/20">
            <div><p className="text-xs text-muted-foreground">Seats Used</p><p className="font-semibold text-foreground">47 / 50</p></div>
            <div><p className="text-xs text-muted-foreground">Billing Cycle</p><p className="font-semibold text-foreground">Monthly</p></div>
            <div><p className="text-xs text-muted-foreground">Monthly Total</p><p className="font-semibold text-foreground">$2,450</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Payment Method</CardTitle>
            <Button size="sm" variant="outline" className="text-xs">Update</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 border border-border rounded-lg w-fit">
            <CreditCard className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Visa •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/27</p>
            </div>
            <Badge className="bg-green-100 text-green-800 text-xs">Default</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Invoice History</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Date", "Description", "Amount", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                        {new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-3 pr-4 text-foreground">{inv.description}</td>
                      <td className="py-3 pr-4 font-semibold text-foreground">${inv.amount.toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <Badge className={inv.status === "paid" ? "bg-green-100 text-green-800 text-xs" : "bg-yellow-100 text-yellow-800 text-xs"}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button size="sm" variant="ghost" className="text-xs gap-1 h-7">
                          <Download className="size-3" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
