"use client";

import type { ProviderConfig } from "@map-kit/core";
import { useRef } from "react";
import {
  showcaseAttributionText,
  showcaseDarkStyle,
  showcaseLightStyle,
} from "./showcase-config";

function getInitialShowcaseStyle(): string {
  if (typeof document === "undefined") {
    return showcaseLightStyle;
  }

  return document.documentElement.classList.contains("dark")
    ? showcaseDarkStyle
    : showcaseLightStyle;
}

export function useShowcaseProvider(): ProviderConfig {
  const providerRef = useRef<ProviderConfig | null>(null);

  if (!providerRef.current) {
    providerRef.current = {
      attribution: showcaseAttributionText,
      provider: "carto",
      styleUrl: getInitialShowcaseStyle(),
    };
  }

  return providerRef.current;
}
