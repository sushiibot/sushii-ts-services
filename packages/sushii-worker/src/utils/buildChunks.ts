export default function buildChunks(
  strings: string[],
  joiner: string,
  maxChunkLength: number
): string[] {
  const chunks: string[] = [];

  let currentChunk = "";

  for (const str of strings) {
    if (currentChunk.length + str.length > maxChunkLength) {
      chunks.push(currentChunk);
      currentChunk = "";
    }

    currentChunk += joiner + str;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}
