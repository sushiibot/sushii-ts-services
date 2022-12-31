import { GatewayDispatchPayload } from "discord-api-types/v10";

export type GatewayDispatchPayloadWithOld = GatewayDispatchPayload & {
  old?: any;
};
