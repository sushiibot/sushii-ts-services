import {
  Client,
  createClient,
  ExecutionResult,
  SubscribePayload,
} from "graphql-ws";
import { DocumentNode, Kind, OperationTypeNode, print } from "graphql";
import ws from "ws";
import { getSdk, Requester } from "../generated/generic";
import Metrics from "./metrics";
import { ConfigI } from "./config";
import logger from "../logger";

const validDocDefOps = ["mutation", "query", "subscription"];

async function execute<T>(
  client: Client,
  payload: SubscribePayload
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let result: T;
    client.subscribe<T>(payload, {
      next: (execRes: ExecutionResult<T, unknown>) => {
        if (execRes.errors) {
          reject(execRes.errors);
        }

        if (execRes.data) {
          result = execRes.data;
        }
      },
      error: reject,
      complete: () => resolve(result),
    });
  });
}

export function getSdkWebsocket(
  client: Client,
  metrics?: Metrics
): ReturnType<typeof getSdk> {
  const requester: Requester = async <R, V>(
    doc: DocumentNode,
    variables: V
  ): Promise<R> => {
    // Valid document should contain *single* query or mutation unless it has a fragment
    if (
      doc.definitions.filter(
        (d) =>
          d.kind === Kind.OPERATION_DEFINITION &&
          validDocDefOps.includes(d.operation)
      ).length !== 1
    ) {
      throw new Error(
        "DocumentNode passed to WebSocket Client must contain single query or mutation"
      );
    }

    const definition = doc.definitions.find(
      (d) => d.kind === Kind.OPERATION_DEFINITION
    );

    const otherDefinitions = doc.definitions.filter(
      (d) => d.kind !== Kind.OPERATION_DEFINITION
    );

    // Valid document should contain *OperationDefinition*
    if (!definition || definition.kind !== Kind.OPERATION_DEFINITION) {
      throw new Error(
        "DocumentNode passed to WebSocket Client must contain single query or mutation"
      );
    }

    switch (definition.operation) {
      case OperationTypeNode.MUTATION:
      case OperationTypeNode.QUERY: {
        const fullQuery =
          print(definition) + otherDefinitions.map(print).join("\n");

        let end;
        if (metrics) {
          end = metrics.sushiiAPIStartTimer();
        }

        const result = execute<R>(client, {
          operationName: definition.name?.value,
          query: fullQuery,
          variables: variables as Record<string, unknown> | null,
        });

        if (end) {
          end();
        }

        return result;
      }
      case OperationTypeNode.SUBSCRIPTION: {
        throw new Error(
          "Subscription requests through SDK interface are not supported"
        );
      }
    }
  };

  return getSdk(requester);
}

export type Sdk = ReturnType<typeof getSdkWebsocket>;

export function getWsClient(config: ConfigI): Client {
  return createClient({
    webSocketImpl: ws,
    url: config.graphqlApiWebsocketURL,
    connectionParams: {
      Authorization: `Bearer ${config.graphqlApiToken}`,
    },
    lazy: false,
    retryAttempts: Infinity,
    shouldRetry: () => true,
    on: {
      connected: () => {
        logger.info("Websocket connected to sushii API");
      },
      error: (err) => {
        logger.error({ err }, "Websocket error");
      },
      ping: (data) => {
        logger.info(data, "Websocket ping");
      },
      pong: (data) => {
        logger.info(data, "Websocket pong");
      },
      closed: (res) => {
        logger.info(res, "Websocket closed");
      },
    },
    onNonLazyError: (err) => {
      logger.error({ err }, "Websocket non-lazy error");
    },
  });
}
