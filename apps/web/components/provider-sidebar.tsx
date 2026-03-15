"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Calendar, Users, MessageSquare, CreditCard,
  ShieldCheck, Settings, LogOut, ChevronLeft, ChevronRight, Heart,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

const navItems = [
  { href: "/provider", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/provider/schedule", icon: Calendar, label: "Schedule" },
  { href: "/provider/clients", icon: Users, label: "Clients" },
  { href: "/provider/messages", icon: MessageSquare, label: "Messages" },
  { href: "/provider/billing", icon: CreditCard, label: "Billing" },
  { href: "/provider/compliance", icon: ShieldCheck, label: "Compliance" },
  { href: "/provider/settings", icon: Settings, label: "Settings" },
];

export function ProviderSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-card border-r border-border transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5">
                <Heart className="size-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-sm font-semibold text-foreground">OpenUp Health</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">EC</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Dr. Emily Chen</p>
              <p className="text-xs text-muted-foreground truncate">Therapist</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="size-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="size-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
