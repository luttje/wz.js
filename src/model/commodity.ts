/**
 * Cash Shop catalogue: `Etc/Commodity.img/<n>`, one entry per sale (serial number `SN`)
 * with the item, count, price and sale period. NPC shop stock is not in the client.
 */
import type { WzFileSystem } from "../fs.ts";
import { scalars, type Scalar } from "./item.ts";

export interface Commodity {
  sn: number;
  itemId: number;
  count: number;
  /** In the Cash Shop's currency. */
  price: number;
  originalPrice: number | null;
  /** Days the item lasts; 0 = permanent (UNVERIFIED). */
  periodDays: number;
  onSale: boolean;
  /** 0 male, 1 female, 2 either (UNVERIFIED). */
  gender: number;
  /** `termEnd` (`YYYYMMDDhh`), when set. */
  ends: string | null;
  /** Every field, raw. */
  fields: Record<string, Scalar>;
}

const cache = new WeakMap<WzFileSystem, Promise<Map<number, Commodity[]>>>();

/** Every commodity, grouped by item ID. */
export function readCommodities(fs: WzFileSystem): Promise<Map<number, Commodity[]>> {
  let result = cache.get(fs);

  if (!result) {
    result = (async () => {
      const root = await fs.get("Etc/Commodity.img");
      const byItem = new Map<number, Commodity[]>();

      for (const entry of root?.children() ?? []) {
        const c: Commodity = {
          sn: entry.int(0, "SN"),
          itemId: entry.int(0, "ItemId"),
          count: entry.int(1, "Count"),
          price: entry.int(0, "Price"),
          originalPrice: entry.child("originalPrice") ? entry.int(0, "originalPrice") : null,
          periodDays: entry.int(0, "Period"),
          onSale: entry.int(0, "OnSale") === 1,
          gender: entry.int(2, "Gender"),
          ends: entry.child("termEnd") ? entry.string("", "termEnd") : null,
          fields: scalars(entry),
        };

        const list = byItem.get(c.itemId) ?? [];

        list.push(c);
        byItem.set(c.itemId, list);
      }

      return byItem;
    })();

    cache.set(fs, result);
  }

  return result;
}
