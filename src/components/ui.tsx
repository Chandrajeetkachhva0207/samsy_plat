import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useLang, type Bi } from "@/lib/lang";
import { FadeIn } from "./FadeIn";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function MalaDivider() {
  return (
    <div className="mala-divider py-6" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className="inline-block rounded-full bg-sand-deep/50"
          style={{ width: i === 4 ? 9 : 5, height: i === 4 ? 9 : 5 }}
        />
      ))}
    </div>
  );
}

export function SectionTitle({ title, sub }: { title: Bi; sub?: Bi }) {
  const { t } = useLang();
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl">{t(title)}</h2>
      <div className="mx-auto mt-3 h-[2px] w-20 rounded-full bg-primary/70" />
      {sub ? <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t(sub)}</p> : null}
    </div>
  );
}

export function PageHeader({ title, sub }: { title: Bi; sub?: Bi }) {
  const { t } = useLang();
  return (
    <header className="border-b border-border bg-sand">
      <Container className="py-10 text-center sm:py-14">
        <h1 className="text-3xl sm:text-4xl">{t(title)}</h1>
        <div className="mx-auto mt-4 h-[2px] w-24 rounded-full bg-primary/70" />
        {sub ? <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t(sub)}</p> : null}
      </Container>
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card-soft p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Section({
  children,
  tone = "plain",
  className = "",
}: {
  children: ReactNode;
  tone?: "plain" | "sand" | "cream";
  className?: string;
}) {
  const toneBg = tone === "sand" || tone === "cream" ? "bg-sand" : "bg-background";
  return (
    <section
      className={`${toneBg} py-12 sm:py-16 ${className}`}
    >
      <Container>
        <FadeIn>{children}</FadeIn>
      </Container>
    </section>
  );
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";

export function PrimaryLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={`${btnBase} bg-primary text-primary-foreground hover:bg-primary/90`}>
      {children}
    </Link>
  );
}

export function OutlineLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={`${btnBase} border border-primary/50 bg-card text-maroon hover:bg-accent`}
    >
      {children}
    </Link>
  );
}

export function EditableNote({ text }: { text?: Bi }) {
  return null;
}