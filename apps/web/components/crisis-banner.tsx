import { Phone } from "lucide-react";

export function CrisisBanner() {
  return (
    <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <Phone className="size-4 text-destructive flex-shrink-0" />
        <span className="text-foreground">
          If you&apos;re in crisis, call{" "}
          <a href="tel:988" className="font-bold text-destructive hover:underline">
            988
          </a>{" "}
          (Suicide &amp; Crisis Lifeline) or text{" "}
          <strong>HOME</strong> to{" "}
          <a href="sms:741741" className="font-bold text-destructive hover:underline">
            741741
          </a>
        </span>
      </div>
    </div>
  );
}
