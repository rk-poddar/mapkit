import type { ReactNode } from "react";

type DocsSectionProps = {
  children: ReactNode;
  id: string;
  title: string;
};

export function DocsSection({ children, id, title }: DocsSectionProps) {
  return (
    <section className="scroll-m-24 space-y-5" id={id}>
      <h2 className="text-foreground text-xl font-semibold tracking-tight">{title}</h2>
      <div className="text-primary [&_strong]:text-foreground space-y-4 text-base leading-7 [&_strong]:font-medium [&>p]:leading-7">
        {children}
      </div>
    </section>
  );
}
