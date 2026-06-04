import type { ComponentDoc } from "../docs-data";

export function ComponentPreview({ component }: { component: ComponentDoc }) {
  return (
    <div className="component-preview">
      {component.slug === "map-controls" ? (
        <div className="preview-toolbar" aria-label="Map controls preview">
          <button type="button">+</button>
          <button type="button">-</button>
          <button type="button">Reset</button>
          <button type="button">⛶</button>
        </div>
      ) : null}
      {component.slug === "marker-badge" ? (
        <div className="marker-preview-set" aria-label="Marker badge preview">
          <span className="fake-marker pin">
            <span>DL</span>
          </span>
          <span className="fake-marker badge">GGN</span>
          <span className="fake-marker dot" />
        </div>
      ) : null}
      {component.slug === "popup-card" ? (
        <div className="fake-popup">
          <strong>Delhi hub</strong>
          <span>Primary NCR warehouse</span>
          <p>18 vehicles assigned.</p>
        </div>
      ) : null}
      {component.slug === "map-legend" ? (
        <div className="fake-legend">
          <strong>Route legend</strong>
          <span>
            <i className="route route-blue" />
            Actual route
          </span>
          <span>
            <i className="route route-gray" />
            Suggested route
          </span>
        </div>
      ) : null}
    </div>
  );
}
