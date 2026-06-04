import { createPortal } from "react-dom";
import { useMapContext } from "../map-context";
import type { CSSProperties } from "react";
import type { MapControlsPosition, MapControlsProps } from "../types";

const POSITION_STYLE: Record<MapControlsPosition, CSSProperties> = {
  "top-left": { left: 12, top: 12 },
  "top-right": { right: 12, top: 12 },
  "bottom-left": { bottom: 12, left: 12 },
  "bottom-right": { bottom: 12, right: 12 },
};

const BUTTON_STYLE: CSSProperties = {
  alignItems: "center",
  background: "#ffffff",
  border: "1px solid #d8e0ea",
  borderRadius: 8,
  boxShadow: "0 8px 18px rgb(15 23 42 / 12%)",
  color: "#142033",
  cursor: "pointer",
  display: "inline-flex",
  fontSize: 16,
  fontWeight: 700,
  height: 34,
  justifyContent: "center",
  lineHeight: 1,
  minWidth: 34,
  padding: "0 10px",
};

export function MapControls({
  buttonClassName,
  buttonStyle,
  position = "top-right",
  zoom = true,
  fullscreen = false,
  reset = false,
  className,
  style,
  unstyled = false,
  labels,
}: MapControlsProps) {
  const { container, controller } = useMapContext();

  if (!container) {
    return null;
  }

  const controls = (
    <div
      className={className}
        data-mapkit-controls={position}
        style={{
          alignItems: "center",
          display: "flex",
          gap: 8,
        pointerEvents: "auto",
        position: "absolute",
        zIndex: 500,
        ...POSITION_STYLE[position],
          ...style,
        }}
    >
      {zoom ? (
        <>
          <button
            aria-label={labels?.zoomIn ?? "Zoom in"}
            className={buttonClassName}
            style={unstyled ? buttonStyle : { ...BUTTON_STYLE, ...buttonStyle }}
            type="button"
            onClick={() => controller.setView(controller.getCenter(), controller.getZoom() + 1)}
          >
            +
          </button>
          <button
            aria-label={labels?.zoomOut ?? "Zoom out"}
            className={buttonClassName}
            style={unstyled ? buttonStyle : { ...BUTTON_STYLE, ...buttonStyle }}
            type="button"
            onClick={() => controller.setView(controller.getCenter(), controller.getZoom() - 1)}
          >
            -
          </button>
        </>
      ) : null}
      {reset ? (
        <button
          aria-label={labels?.reset ?? "Reset view"}
          className={buttonClassName}
          style={unstyled ? buttonStyle : { ...BUTTON_STYLE, fontSize: 13, ...buttonStyle }}
          type="button"
          onClick={() => {
            if (typeof reset === "object") {
              controller.setView(reset.center, reset.zoom);
              return;
            }

            controller.setView(controller.getCenter(), controller.getZoom());
          }}
        >
          Reset
        </button>
      ) : null}
      {fullscreen ? (
        <button
          aria-label={labels?.fullscreen ?? "Toggle fullscreen"}
          className={buttonClassName}
          style={unstyled ? buttonStyle : { ...BUTTON_STYLE, ...buttonStyle }}
          type="button"
          onClick={() => {
            if (document.fullscreenElement) {
              void document.exitFullscreen();
              return;
            }

            void container.requestFullscreen?.();
          }}
        >
          ⛶
        </button>
      ) : null}
    </div>
  );

  return createPortal(controls, container);
}
