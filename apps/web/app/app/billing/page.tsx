"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Download, Plus, CheckCircle } from "lucide-react";

const mockInvoices = [
  { id: "inv1", date: "2026-03-01", description: "Session with Dr. Emily Chen", amount: 150, status: "paid" },
  { id: "inv2", date: "2026-02-12", description: "Session with Dr. Emily Chen", amount: 150, status: "paid" },
  { id: "inv3", date: "2026-01-29", description: "Session with Dr. Emily Chen", amount: 150, status: "paid" },
  { id: "inv4", date: "2026-01-15", description: "Session with Dr. Emily Chen", amount: 150, status: "paid" },
];

const mockPaymentMethods = [
  { id: "pm1", brand: "Visa", last4: "4242", expiry: "12/27", isDefault: true },
  { id: "pm2", brand: "Mastercard", last4: "8888", expiry: "09/26", isDefault: false },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<typeof mockInvoices>([]);
  const [paymentMethods, setPaymentMethods] = useState<typeof mockPaymentMethods>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [invRes, pmRes] = await Promise.all([
          fetch("/api/billing/invoices"),
          fetch("/api/billing/payment-methods"),
        ]);
        const invData = invRes.ok ? await invRes.json() : null;
        const pmData = pmRes.ok ? await pmRes.json() : null;
        setInvoices(Array.isArray(invData) && invData.length > 0 ? invData : mockInvoices);
        setPaymentMethods(Array.isArray(pmData) && pmData.length > 0 ? pmData : mockPaymentMethods);
      } catch {
        setInvoices(mockInvoices);
        setPaymentMethods(mockPaymentMethods);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage payments, invoices, and billing details</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Current Plan</p>
              <h2 className="text-lg font-bold text-foreground">Individual – Self Pay</h2>
              <p className="text-sm text-muted-foreground">$150 per session · No subscription</p>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Payment Methods</CardTitle>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Plus className="size-3" /> Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{pm.brand} •••• {pm.last4}</p>
                      <p className="text-xs text-muted-foreground">Expires {pm.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pm.isDefault && (
                      <Badge className="bg-primary/10 text-primary text-xs gap-1">
                        <CheckCircle className="size-3" /> Default
                      </Badge>
                    )}
                    {!pm.isDefault && (
                      <Button size="sm" variant="ghost" className="text-xs">Set Default</Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive">Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground pb-2">Date</th>
                    <th className="text-left text-xs font-medium text-muted-foreground pb-2">Description</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-2">Amount</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-2">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground pb-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 text-muted-foreground whitespace-nowrap">{new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="py-3 text-foreground">{inv.description}</td>
                      <td className="py-3 text-right font-medium text-foreground">${inv.amount}</td>
                      <td className="py-3 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 text-right">
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
