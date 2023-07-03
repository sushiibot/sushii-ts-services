import { html2png } from ".";
import fs from "fs/promises";
import { html } from "satori-html";

async function main() {
  const m = html`<div style="color: white">hi</div>`;

  const png = await html2png(m, {
    width: 1280,
    height: 720,
    satoriOptions: {},
    reSvgOptions: {},
  });

  const data = png.asPng();

  await fs.writeFile("./test.png", data);
}

main();
