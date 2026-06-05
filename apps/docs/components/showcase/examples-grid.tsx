import { AnalyticsExample } from "./analytics-example";
import { DeliveryExample } from "./delivery-example";
import { EVChargingExample } from "./ev-charging-example";
import { GlobeExample } from "./globe-example";
import { TrailExample } from "./trail-example";
import { TrendingExample } from "./trending-example";

export function ExamplesGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <AnalyticsExample />
      <TrailExample />
      <GlobeExample />
      <EVChargingExample />
      <TrendingExample />
      <DeliveryExample />
    </div>
  );
}
