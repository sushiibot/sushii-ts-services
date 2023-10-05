import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-node";
import { Tracer, Span, SpanStatusCode } from "@opentelemetry/api";
import logger from "./logger";
import config from "./model/config";

// Only create traces for 1% of events
const samplePercentage = 0.01;

const exporterOptions = {
  // Default URL
  url: config.TRACING_EXPORTER_URL || "http://localhost:4318/v1/traces",
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "sushii_worker",
  }),
  sampler: new TraceIdRatioBasedSampler(samplePercentage),
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk
  .start()
  .then(() => logger.info(exporterOptions, "Tracing initialized"))
  .catch((error) => logger.error(error, "Error initializing tracing"));

export default sdk;

/**
 * Starts a new active span and automatically catches errors and ends the span.
 *
 * @param tracer
 * @param name
 * @param fn
 * @returns
 */
export function startCaughtActiveSpan<F extends (span?: Span) => unknown>(
  tracer: Tracer,
  name: string,
  fn: F
): ReturnType<F> {
  return tracer.startActiveSpan(name, ((span: Span) => {
    try {
      return fn(span);
    } catch (err) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err instanceof Error ? err.message : "Unknown error",
      });

      throw err;
    } finally {
      span.end();
    }
  }) as F);
}
