import Context from "../model/context";

export default interface PeriodicJob {
  name: string;
  cronTime: string;
  onTick(ctx: Context): Promise<void>;
}
