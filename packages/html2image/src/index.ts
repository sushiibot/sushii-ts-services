import { Resvg, ResvgRenderOptions, initWasm } from "@resvg/resvg-wasm";
import satori, { SatoriOptions } from "satori";
import type { html } from "satori-html";
import fs from "fs/promises";
import path from "path";
import type React from "react";

let initialized = false;
let notoSans: Buffer;
async function init() {
  const wasmPath = path.join(
    process.cwd(),
    "./../../node_modules/@resvg/resvg-wasm/index_bg.wasm"
  );

  const m = await fs.readFile(wasmPath);
  await initWasm(m);
  notoSans = await fs.readFile("./src/NotoSans-Regular.ttf");
  initialized = true;
}

export type Html2PngOptions = {
  width: number;
  height: number;
  satoriOptions?: Partial<SatoriOptions>;
  reSvgOptions?: ResvgRenderOptions;
};

export async function html2png(
  markup: ReturnType<typeof html> | React.ReactNode,
  { width, height, satoriOptions, reSvgOptions }: Html2PngOptions
) {
  if (!initialized) {
    await init();
  }

  const m = markup as React.ReactNode;
  const svg = await satori(m, {
    width,
    height,
    fonts: satoriOptions?.fonts ?? /* Fallback to basic font */ [
      {
        name: "Roboto",
        data: notoSans,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, reSvgOptions);
  const pngData = resvg.render();

  return pngData;
}
