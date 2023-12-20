import React from "react";
import satori, { SatoriOptions } from "satori";
import sharp from "sharp";

/**
 * Converts a React element to a PNG image.
 *
 * @param element ReactNode
 * @param options SatoriOptions
 * @returns PNG buffer
 */
export async function getImageFromReact(
  element: React.ReactNode,
  options: SatoriOptions,
) {
  const svg = await satori(element, options);

  const png = await sharp(Buffer.from(svg), {
    unlimited: true,
  })
    .png()
    .toBuffer();

  return png;
}
