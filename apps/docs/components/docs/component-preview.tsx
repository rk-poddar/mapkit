import type { ReactNode } from "react";
import { highlightCode } from "@/lib/highlight";
import { ComponentPreviewClient } from "./component-preview-client";

type ComponentPreviewProps = {
  children: ReactNode;
  className?: string;
  code: string;
  language?: string;
};

export async function ComponentPreview({ children, className, code, language = "tsx" }: ComponentPreviewProps) {
  const highlightedCode = await highlightCode(code, language);

  return (
    <ComponentPreviewClient className={className} code={code} highlightedCode={highlightedCode}>
      {children}
    </ComponentPreviewClient>
  );
}
