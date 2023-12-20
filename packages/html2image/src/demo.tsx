import { readFile, writeFile } from "node:fs/promises";
import { SatoriOptions } from "satori";
import React from "react";
import { getImageFromReact } from "./getImage.js";

const options: SatoriOptions = {
  width: 420,
  height: 475,
  fonts: [
    {
      name: "Roboto",
      data: await readFile("./src//NotoSans-Regular.ttf"),
      weight: 400,
      style: "normal",
    },
  ],
};

const img = await getImageFromReact(
  <div style={{ color: "#fff" }}>this is an example!</div>,
  options,
);

await writeFile("./output.png", img);
