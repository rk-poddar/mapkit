"use client";

import type { ComponentGuide } from "@/app/docs-data";
import { BasicMapExample } from "./examples/basic-map-example";
import { ControlledMapExample } from "./examples/controlled-map-example";
import { ControlsExample } from "./examples/controls-example";
import { MarkersExample } from "./examples/markers-example";
import { RoutesExample } from "./examples/routes-example";

type GuideExampleProps = {
  preview: ComponentGuide["preview"];
  sectionId?: string;
};

export function GuideExample({ preview, sectionId }: GuideExampleProps) {
  if (preview === "map") {
    if (sectionId === "controlled-mode") {
      return <ControlledMapExample />;
    }
    return <BasicMapExample />;
  }

  if (preview === "controls") {
    return <ControlsExample />;
  }

  if (preview === "markers") {
    return <MarkersExample />;
  }

  if (preview === "routes") {
    return <RoutesExample />;
  }

  return <BasicMapExample />;
}
