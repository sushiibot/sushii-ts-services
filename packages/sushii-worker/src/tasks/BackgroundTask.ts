import Context from "../model/context";

export default interface BackgroundTask {
  name: string;
  cronTime: string;
  onTick(ctx: Context): Promise<void>;
}
