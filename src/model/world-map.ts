/**
 * World maps: `Map/WorldMap/WorldMap<NNN>.img`, one per region (WorldMap000 is Maple Island,
 * WorldMap001 Victoria Island). See docs/data-model/map.md ("World maps").
 *
 *   info/WorldMap      the image's own name
 *   info/parentMap     the world map one level up, when there is one
 *   BaseImg/0          the painted map (its origin is the map's centre)
 *   MapList/<n>        spots: `spot` (relative to the centre), `type` (icon in
 *                      `Map/MapHelper.img/worldMap/mapImage/<type>`), `mapNo/<i>` (the maps
 *                      the spot stands for) and an optional `title` / `desc`
 *   MapLink/<n>        sub-maps: `link/linkMap` and a clickable `link/linkImg` canvas
 */
import type { WzFileSystem } from "../fs.ts";
import type { WzNode } from "../node.ts";
import { mapImagePath } from "./map.ts";

export interface WorldMapSpot {
  x: number;
  y: number;
  type: number;
  maps: number[];
  title?: string;
  desc?: string;
  /** The emblem (`Map/MapHelper.img/mark/<mark>`) of the spot's first map, when it has one. */
  mark?: string;
}

export interface WorldMapLink {
  /** The world map it opens (`WorldMap010`). */
  map: string;
  /** Clickable area drawn over the base image. */
  canvas: string;
  tooltip?: string;
}

export interface WorldMap {
  name: string;
  parent?: string;
  /** The base image canvas. */
  base: string;
  spots: WorldMapSpot[];
  links: WorldMapLink[];
}

export async function readWorldMaps(fs: WzFileSystem): Promise<WorldMap[]> {
  const out: WorldMap[] = [];

  for (const image of fs.imagesUnder("Map/WorldMap")) {
    if (!/^Map\/WorldMap\/WorldMap\d+\.img$/.test(image.path)) {
      continue;
    }

    const root = await fs.get(image.path);
    const map = root && readWorldMap(root, image.name.replace(".img", ""));

    if (map) {
      for (const spot of map.spots) {
        const first = spot.maps[0];
        const mark = first === undefined ? "" : ((await fs.get(`${mapImagePath(first)}/info/mapMark`))?.string("") ?? "");

        spot.mark = mark || undefined;
      }

      out.push(map);
    }
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function readWorldMap(root: WzNode, fallbackName: string): WorldMap | null {
  const base = root.get("BaseImg/0");

  if (base?.kind !== "canvas") {
    return null;
  }

  const parent = root.string("", "info/parentMap");

  return {
    name: root.string(fallbackName, "info/WorldMap"),
    parent: parent || undefined,
    base: base.path,
    spots: numbered(root.get("MapList")).map((n) => {
      const spot = n.get("spot")?.vector();

      return {
        x: spot?.x ?? 0,
        y: spot?.y ?? 0,
        type: n.int(0, "type"),
        maps: numbered(n.get("mapNo")).map((m) => m.int(0)),
        title: n.string("", "title") || undefined,
        desc: n.string("", "desc") || undefined,
      };
    }),
    links: numbered(root.get("MapLink")).flatMap((n) => {
      const canvas = n.get("link/linkImg");
      const map = n.string("", "link/linkMap");

      return canvas?.kind === "canvas" && map ? [{ map, canvas: canvas.path, tooltip: n.string("", "toolTip") || undefined }] : [];
    }),
  };
}

function numbered(node: WzNode | undefined): WzNode[] {
  return (node?.children() ?? []).filter((c) => /^\d+$/.test(c.name)).sort((a, b) => Number(a.name) - Number(b.name));
}
