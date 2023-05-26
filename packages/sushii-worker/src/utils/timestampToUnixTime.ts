export default function timestampToUnixTime(ts: number): number {
  return Math.floor(ts / 1000);
}
