import { Shield, Lock, Eye, Server, CheckCircle, FileText } from "lucide-react";

export const metadata = { title: "Security & Privacy" };

const practices = [
  { icon: Lock, title: "End-to-End Encryption", description: "All video sessions, messages, and file transfers are encrypted using AES-256 encryption. Your data is unreadable to anyone except you and your therapist." },
  { icon: Eye, title: "Privacy by Design", description: "We collect only the minimum data necessary to provide our services. Your session content is never used for marketing or analytics." },
  { icon: Server, title: "Secure Infrastructure", description: "Our platform is hosted on SOC 2-compliant infrastructure with regular security audits and penetration testing." },
  { icon: Shield, title: "HIPAA-Conscious Practices", description: "While we operate with HIPAA-conscious practices throughout our platform, we are transparent that formal HIPAA certification is an ongoing process." },
  { icon: FileText, title: "Data Access Controls", description: "Strict role-based access controls ensure only authorized personnel can access system data. All access is logged and auditable." },
  { icon: CheckCircle, title: "Regular Audits", description: "We conduct regular internal and external security audits to identify and address potential vulnerabilities." },
];

export default function SecurityPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-6">
            <Shield className="size-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">Security & Privacy</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your privacy is our priority. We have built our platform from the ground up with security and confidentiality at its core.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practices.map((p) => (
              <div key={p.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <p.icon className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Your Rights</h2>
          <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
            {[
              { title: "Access Your Data", description: "You can request a copy of all personal data we hold about you at any time." },
              { title: "Delete Your Data", description: "You have the right to request deletion of your account and associated data, subject to legal retention requirements." },
              { title: "Control Sharing", description: "You control who can access your information. We never share data with third parties for marketing purposes." },
              { title: "Transparent Practices", description: "We clearly disclose what data we collect, why we collect it, and how it is used in our Privacy Policy." },
            ].map((right) => (
              <div key={right.title} className="flex items-start gap-4">
                <CheckCircle className="size-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground">{right.title}</h3>
                  <p className="text-muted-foreground text-sm">{right.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Have Security Questions?</h2>
          <p className="text-muted-foreground mb-8">
            Our security team is available to answer any questions about our privacy practices.
          </p>
          <a
            href="mailto:security@openuphealth.com"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block font-medium"
          >
            Contact Security Team
          </a>
        </div>
      </section>
    </>
  );
}
