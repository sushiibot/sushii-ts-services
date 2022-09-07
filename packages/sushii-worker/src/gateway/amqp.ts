import {
  AMQPClient,
  AMQPConsumer,
  AMQPError,
  AMQPMessage,
} from "@cloudamqp/amqp-client";
import logger from "../logger";
import { ConfigI } from "../model/config";

export default class AmqpGateway {
  consumer?: AMQPConsumer;

  reconnectCount: number = 0;

  constructor(private amqp: AMQPClient, private config: ConfigI) {}

  async connect(handler: (msg: AMQPMessage) => Promise<void>): Promise<void> {
    logger.info("connecting to rabbitmq...");

    const conn = await this.amqp.connect();
    const channel = await conn.channel();
    const queue = await channel.queue(this.config.amqpQueueName);

    // Automatically acknowledge messages, as recovering from tasks isn't that
    // important -- detection of failed tasks would be much too slow and would
    // rather respond with an immediate error (ie. Discord's built in failed to
    // respond to interaction).
    this.consumer = await queue.subscribe({ noAck: true }, handler);

    logger.info("connected to rabbitmq!");

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

  async stop(): Promise<void> {
    try {
      await this.consumer?.cancel();
      await this.amqp.close();
    } catch (err) {
      logger.error(err, "error closing amqp");
    }
  }
}
