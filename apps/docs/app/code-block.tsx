"use client";

import { useState } from "react";

type CodeBlockProps = {
  code: string;
  label?: string;
};

export function CodeBlock({ code, label = "Code" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copyWithFallback() {
    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const didCopy = document.execCommand("copy");
    document.body.removeChild(textarea);
    return didCopy;
  }

  async function copyCode() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        copyWithFallback();
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      if (copyWithFallback()) {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    }
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{label}</span>
        <button aria-label={`Copy ${label}`} onClick={copyCode} type="button">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
