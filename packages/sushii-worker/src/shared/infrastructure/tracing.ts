import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-node";
import { Tracer, Span, SpanStatusCode } from "@opentelemetry/api";
import logger from "../../shared/infrastructure/logger";
import { config } from "@/shared/infrastructure/config";

const exporterOptions = {
  // Default URL
  url: config.tracing.exporterUrl || "http://localhost:4318/v1/traces",
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "sushii_worker",
    // No version yet
    // [ATTR_SERVICE_VERSION]: "v1.0.0"
  }),
  sampler: new TraceIdRatioBasedSampler(config.tracing.samplePercentage),
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start();
logger.info(exporterOptions, "Tracing initialized");

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
  fn: F,
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
