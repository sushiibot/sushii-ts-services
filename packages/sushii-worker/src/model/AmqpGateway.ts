import {
  AMQPClient,
  AMQPConsumer,
  AMQPError,
  AMQPMessage,
  AMQPQueue,
} from "@cloudamqp/amqp-client";
import { GatewaySendPayload } from "discord-api-types/gateway/v10";
import logger from "../logger";
import { ConfigI } from "./config";

const QUEUE_GATEWAY_SEND = "gateway.send";
const QUEUE_GATEWAY_RECEIVE = "gateway.recv";

export default class AmqpGateway {
  consumer?: AMQPConsumer;

  reconnectCount: number = 0;

  private sendQueue?: AMQPQueue;

  constructor(private amqp: AMQPClient, private config: ConfigI) {}

  async connect(handler: (msg: AMQPMessage) => Promise<void>): Promise<void> {
    logger.info("connecting to rabbitmq...");

    const conn = await this.amqp.connect();
    logger.info("connected to rabbitmq!");

    const channel = await conn.channel();
    const queue = await channel.queue(QUEUE_GATEWAY_RECEIVE);

    // Automatically acknowledge messages, as recovering from tasks isn't that
    // important -- detection of failed tasks would be much too slow and would
    // rather respond with an immediate error (ie. Discord's built in failed to
    // respond to interaction).
    this.consumer = await queue.subscribe({ noAck: true }, handler);
    logger.info("subscribed to receive event queue");

    // Connect to send queue
    this.sendQueue = await channel.queue(QUEUE_GATEWAY_SEND);
    logger.info("Connected to send queue");

    // Set reconnect handler
    this.amqp.onerror = (err: AMQPError): void => {
      logger.error(err, "amqp error");

      this.reconnectCount += 1;

      // Reconnect after reconnectCount^2 seconds
      // 1, 2, 4, 9, 16, etc
      setTimeout(() => {
        logger.info("reconnecting to rabbitmq...");
        this.connect(handler);
      }, 1000 * this.reconnectCount * this.reconnectCount);
    };
  }

  async send(payload: GatewaySendPayload): Promise<void> {
    if (!this.sendQueue) {
      throw new Error("send queue not initialized");
    }

    // Transient mode, not persisted as we don't really care about messages being
    // lost due to rabbitmq restarts
    await this.sendQueue.publish(JSON.stringify(payload));
  }

  async stop(): Promise<void> {
    try {
      await this.consumer?.cancel();
      await this.amqp.close();
    } catch (err) {
      logger.error(err, "error closing amqp");
    }
  }
}
