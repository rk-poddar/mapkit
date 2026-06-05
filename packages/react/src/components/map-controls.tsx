import { createPortal } from "react-dom";
import { useMapContext } from "../map-context";
import type { CSSProperties, ReactNode } from "react";
import type { MapControlsPosition, MapControlsProps } from "../types";

const POSITION_STYLE: Record<MapControlsPosition, CSSProperties> = {
  "top-left": { left: 8, top: 8 },
  "top-right": { right: 8, top: 8 },
  "bottom-left": { bottom: 8, left: 8 },
  "bottom-right": { bottom: 40, right: 8 },
};

const getIsDark = () => {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
};

const getThemeTokens = (isDark: boolean) => {
  if (isDark) {
    return {
      groupBg: "rgba(2, 6, 12, 0.45)",
      groupBorder: "rgba(255, 255, 255, 0.14)",
      buttonColor: "rgba(248, 250, 252, 0.96)",
      buttonHoverBg: "rgba(148, 163, 184, 0.14)",
    };
  }

  return {
    groupBg: "rgba(255, 255, 255, 0.85)",
    groupBorder: "rgba(15, 23, 42, 0.12)",
    buttonColor: "rgba(15, 23, 42, 0.92)",
    buttonHoverBg: "rgba(148, 163, 184, 0.22)",
  };
};

const BASE_BUTTON_STYLE: CSSProperties = {
  alignItems: "center",
  background: "transparent",
  border: "none",
  color: "inherit",
  cursor: "pointer",
  display: "inline-flex",
  fontSize: 16,
  fontWeight: 600,
  height: 32,
  justifyContent: "center",
  lineHeight: 1,
  minWidth: 32,
  padding: 0,
};

const groupStyleBase: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: 8,
  border: "1px solid transparent",
  boxShadow: "0 6px 18px rgba(0,0,0,0.20)",
  backdropFilter: "blur(6px)",
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
  const isDark = getIsDark();
  const tokens = getThemeTokens(isDark);

  if (!container) {
    return null;
  }

  const getNativeMap = () => controller.getNativeMap?.() as unknown;

  const handleZoomTo = (nextZoom: number) => {
    const nativeMap = getNativeMap() as { easeTo?: unknown; getZoom?: unknown } | undefined;

    // MapLibre native animation
    if (nativeMap && typeof (nativeMap as { easeTo?: unknown }).easeTo === "function") {
      (nativeMap as { easeTo: (opts: { zoom: number; duration: number }) => void }).easeTo({
        zoom: nextZoom,
        duration: 300,
      });
      return;
    }

    // Fallback for non-MapLibre engines
    controller.setView(controller.getCenter(), nextZoom);
  };

  const renderButton = ({
    ariaLabel,
    onClick,
    children: inner,
    isLast,
    isFirst,
  }: {
    ariaLabel: string;
    onClick: () => void;
    children: ReactNode;
    isFirst: boolean;
    isLast: boolean;
  }) => {
    const baseStyle: CSSProperties = unstyled
      ? buttonStyle ?? {}
      : {
          ...BASE_BUTTON_STYLE,
          color: tokens.buttonColor,
          borderBottom: isLast ? undefined : `1px solid ${tokens.groupBorder}`,
          borderTopLeftRadius: isFirst ? 8 : 0,
          borderTopRightRadius: isFirst ? 8 : 0,
          borderBottomLeftRadius: isLast ? 8 : 0,
          borderBottomRightRadius: isLast ? 8 : 0,
        };

    return (
      <button
        aria-label={ariaLabel}
        className={buttonClassName}
        style={{ ...baseStyle, ...(buttonStyle ?? {}) }}
        type="button"
        onClick={onClick}
        onMouseEnter={(e) => {
          if (unstyled) return;
          const target = e.currentTarget;
          target.style.backgroundColor = tokens.buttonHoverBg;
        }}
        onMouseLeave={(e) => {
          if (unstyled) return;
          const target = e.currentTarget;
          target.style.backgroundColor = "transparent";
        }}
      >
        {inner}
      </button>
    );
  };

  const controls = (
    <div
      className={className}
      data-mapkit-controls={position}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        pointerEvents: "auto",
        position: "absolute",
        zIndex: 500,
        ...POSITION_STYLE[position],
        ...style,
      }}
    >
      {zoom ? (
        <div
          style={{
            ...groupStyleBase,
            background: tokens.groupBg,
            borderColor: tokens.groupBorder,
          }}
        >
          {renderButton({
            ariaLabel: labels?.zoomIn ?? "Zoom in",
            onClick: () => handleZoomTo(controller.getZoom() + 1),
            children: "+",
            isFirst: true,
            isLast: false,
          })}
          {renderButton({
            ariaLabel: labels?.zoomOut ?? "Zoom out",
            onClick: () => handleZoomTo(controller.getZoom() - 1),
            children: "-",
            isFirst: false,
            isLast: true,
          })}
        </div>
      ) : null}

      {reset ? (
        <div
          style={{
            ...groupStyleBase,
            background: tokens.groupBg,
            borderColor: tokens.groupBorder,
          }}
        >
          {renderButton({
            ariaLabel: labels?.reset ?? "Reset view",
            onClick: () => {
              const nativeMap = getNativeMap() as unknown;

              if (typeof reset === "object") {
                if (nativeMap && typeof (nativeMap as { flyTo?: unknown }).flyTo === "function") {
                  const zoomTarget = reset.zoom ?? controller.getZoom();
                  (nativeMap as { flyTo: (opts: { center: [number, number]; zoom: number; duration: number }) => void })
                    .flyTo({
                      center: [reset.center[1], reset.center[0]],
                      zoom: zoomTarget,
                      duration: 300,
                    });
                  return;
                }

                controller.setView(reset.center, reset.zoom);
                return;
              }

              controller.setView(controller.getCenter(), controller.getZoom());
            },
            children: "⌖",
            isFirst: true,
            isLast: true,
          })}
        </div>
      ) : null}

      {fullscreen ? (
        <div
          style={{
            ...groupStyleBase,
            background: tokens.groupBg,
            borderColor: tokens.groupBorder,
          }}
        >
          {renderButton({
            ariaLabel: labels?.fullscreen ?? "Toggle fullscreen",
            onClick: () => {
              if (document.fullscreenElement) {
                void document.exitFullscreen();
                return;
              }

              void container.requestFullscreen?.();
            },
            children: "⛶",
            isFirst: true,
            isLast: true,
          })}
        </div>
      ) : null}
    </div>
  );

  return createPortal(controls, container);
}
