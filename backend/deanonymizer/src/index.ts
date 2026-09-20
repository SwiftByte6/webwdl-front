#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPaths = [
  resolve(process.cwd(), ".env"),
  resolve(__dirname, "../.env"),
  resolve(__dirname, "../../.env"),
];
for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    try {
      process.loadEnvFile?.(envPath);
    } catch {}
  }
}
import { CONSENT_BANNER, requireConsent } from "./consent.js";
import { fetchReddit } from "./sources/reddit.js";
import { analyze } from "./analyze.js";
import { createLLMClient } from "./llm/index.js";
import { renderJson, renderText } from "./report.js";
import type { Profile } from "./types.js";

const program = new Command();

program
  .name("audit")
  .description(
    "deanonymizer — consent-based privacy exposure auditor. Pull your Reddit\n" +
      "history and report what an attacker could infer, so you can scrub it.\n" +
      "Defensive mirror of the deanonymization attack in arXiv:2602.16800.",
  )
  .version("0.1.0");

program
  .argument(
    "[reddit-username]",
    "Reddit username to audit (also accepts u/name)",
  )
  .option(
    "--reddit <username>",
    "Reddit username (alternative to positional arg)",
  )
  .option("-n, --max <n>", "Max items per platform to fetch", "300")
  .option(
    "--max-chars <n>",
    "Max characters of transcript sent to the LLM",
    "120000",
  )
  .option(
    "--concurrency <n>",
    "Number of analysis chunks to process in parallel (default: all chunks at once, up to 8)",
  )
  .option(
    "--provider <name>",
    "LLM provider: 'anthropic', 'openai', or 'claude-code' (default: auto-detect from env)",
  )
  .option(
    "--base-url <url>",
    "OpenAI-compatible base URL (e.g. Gemini, Ollama, Groq); implies --provider openai",
  )
  .option(
    "--model <name>",
    "Override the model name (else ANTHROPIC_MODEL / OPENAI_MODEL / provider default)",
  )
  .option("--json", "Emit JSON instead of a human report")
  .option(
    "--require-external-proof",
    "Fail if no public proof URL exists beyond the audited platform profile pages",
  )
  .option("-o, --out <file>", "Write the report to a file")
  .option(
    "--i-am-authorized",
    "Skip the interactive consent prompt (asserts you own/are authorized for the target)",
  )
  .action(async (positional, opts) => {
    const redditUser = opts.reddit ?? positional;

    if (!redditUser) {
      console.error(
        pc.red("Provide a Reddit handle to audit.\n") +
          "Examples:\n" +
          "  audit my_reddit_handle\n" +
          "  audit --reddit my_reddit_handle",
      );
      process.exit(1);
    }

    if (!opts.json) console.error(CONSENT_BANNER);

    const subjectLabel = `reddit:${redditUser}`;
    await requireConsent({
      username: subjectLabel,
      assumeYes: Boolean(opts.iAmAuthorized),
    });

    const max = Number.parseInt(opts.max, 10);
    const maxChars = Number.parseInt(opts.maxChars, 10);
    const concurrency = opts.concurrency
      ? Math.max(1, Number.parseInt(opts.concurrency, 10) || 1)
      : undefined;

    // Resolve the LLM backend up front so a misconfigured provider fails before
    // we spend time fetching public history.
    const llm = createLLMClient({
      provider: opts.provider,
      baseUrl: opts.baseUrl,
      model: opts.model,
    });
    process.stderr.write(pc.dim(`Using ${llm.label} model ${llm.model}\n`));

    const profiles: Profile[] = [];

    process.stderr.write(pc.dim(`Fetching Reddit history for ${redditUser}… `));
    const p = await fetchReddit(redditUser, max);
    process.stderr.write(pc.dim(`${p.items.length} items\n`));
    if (p.items.length) profiles.push(p);

    if (profiles.length === 0) {
      console.error(
        pc.red("No public content found. Check the username(s) and try again."),
      );
      process.exit(1);
    }

    process.stderr.write(pc.dim("Analyzing footprint…\n"));
    const result = await analyze(profiles, {
      llm,
      maxChars,
      chunkConcurrency: concurrency,
      onProgress: (p) => {
        const chunkLabel =
          p.currentChunk && p.totalChunks
            ? ` [chunk ${p.currentChunk}/${p.totalChunks}]`
            : "";
        process.stderr.write(
          pc.dim(
            `  ${String(p.percent).padStart(3, " ")}%  ${p.message}${chunkLabel}\n`,
          ),
        );
      },
    });

    if (opts.requireExternalProof) {
      const platformProfileUrls = new Set(
        result.platformProfiles.map((p) => p.profileUrl),
      );
      const externalProofUrls = (result.identity.publicProofUrls ?? []).filter(
        (u) => !platformProfileUrls.has(u),
      );

      if (externalProofUrls.length === 0) {
        console.error(
          pc.red(
            "Validation failed: no external public proof URL found beyond audited platform profile pages.",
          ) +
            "\nTry increasing --max/--max-chars, or add more sources where public links are present.",
        );
        process.exit(2);
      }
    }

    const output = opts.json ? renderJson(result) : renderText(result);

    if (opts.out) {
      await writeFile(opts.out, output, "utf8");
      console.error(pc.green(`Report written to ${opts.out}`));
    } else {
      console.log(output);
    }
  });

program.parseAsync().catch((err) => {
  console.error(pc.red(`\nError: ${err.message ?? err}`));
  process.exit(1);
});
