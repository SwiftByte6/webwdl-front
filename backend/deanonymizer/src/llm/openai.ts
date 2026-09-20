import OpenAI from "openai";
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";
import type { LLMClient, LLMCompleteParams } from "./types.js";

/**
 * OpenAI-compatible backend. By configuring `baseURL` this also drives Gemini
 * (generativelanguage…/openai/), Ollama (localhost:11434/v1), Groq, Together,
 * and any other Chat Completions-compatible endpoint. No prompt caching —
 * `response_format: json_object` is requested when supported, and the caller's
 * JSON-repair path still runs as a safety net for endpoints that ignore it.
 */
export class OpenAIClient implements LLMClient {
  readonly label: string;
  readonly model: string;
  private readonly client: OpenAI;

  constructor(config: { apiKey: string; baseUrl?: string; model: string }) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      ...(config.baseUrl ? { baseURL: config.baseUrl } : {}),
    });
    this.model = config.model;
    this.label = config.baseUrl ? `openai (base: ${config.baseUrl})` : "openai";
  }

  async complete(params: LLMCompleteParams): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [];
    if (params.system)
      messages.push({ role: "system", content: params.system });
    messages.push({ role: "user", content: params.user });

    const request: ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      max_tokens: params.maxTokens,
      messages,
      ...(params.json ? { response_format: { type: "json_object" } } : {}),
    };

    let lastError: unknown;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const resp = await this.client.chat.completions.create(request);
        const choice = resp.choices[0];
        const content = choice?.message?.content;
        if (!content) {
          throw new Error(
            `${this.label} returned no content` +
              (choice?.finish_reason
                ? ` (finish_reason: ${choice.finish_reason})`
                : ""),
          );
        }
        return content;
      } catch (error: any) {
        lastError = error;
        const status = error?.status ?? error?.statusCode;
        const message = error instanceof Error ? error.message : String(error);
        if (
          (status === 429 ||
            status === 500 ||
            status === 502 ||
            status === 503 ||
            message.includes("429") ||
            message.includes("RESOURCE_EXHAUSTED")) &&
          attempt < 3
        ) {
          const delayMs = 2000 * Math.pow(2, attempt) + Math.random() * 500;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        throw new Error(`${this.label} request failed: ${message}`);
      }
    }

    const message =
      lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(`${this.label} request failed: ${message}`);
  }
}
