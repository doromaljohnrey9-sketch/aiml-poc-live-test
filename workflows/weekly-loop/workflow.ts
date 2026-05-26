// import { sleep } from "workflow";
import { getNextScheduledRun } from "@/lib/workflow/scheduler";
import {
  fetchLoopConfig,
  fetchPendingSources,
  notifyOperators,
  logWorkflowExecution,
  scrapeIfUrl,
  generateContent,
  storeGeneratedContent,
  markSourceContentGenerated,
} from "./steps";
import { runBannedPhraseFilter, regenerateWithBannedPhrases } from "../shared/bannedPhraseFilter";

export async function aimlWeeklyLoop() {
  "use workflow";

  const config = await fetchLoopConfig();
  if (!config.weeklyLoopEnabled) {
    console.log("Weekly loop is disabled. Aborting.");
    return;
  }

  // Calculate next scheduled run time based on system_config
  const nextRun = getNextScheduledRun(config.loopDay, config.loopTime);
  const now = new Date();
  const delayMs = nextRun.getTime() - now.getTime();

  // Sleep until the scheduled time if it's in the future
  // TODO: Uncomment after testing
  // if (delayMs > 0) {
  //   console.log(
  //     `Sleeping until ${nextRun.toISOString()} (${config.loopDay} at ${config.loopTime} UTC)`
  //   );
  //   await sleep(delayMs);
  // }

  const sources = await fetchPendingSources();

  for (const source of sources) {
    // Scrape URL if needed
    const text = await scrapeIfUrl(source);

    // Generate content with AI (mock implementation)
    const draft = await generateContent(text, source.contextNote, source.language);

    // Run banned phrase filter
    const filterResult = await runBannedPhraseFilter(JSON.stringify(draft));

    let filtered = draft;
    let attempt = 0;

    // Regenerate if banned phrases detected (max 2 retries)
    while (filterResult.hasBannedPhrases && attempt < 2) {
      console.log(
        `Banned phrases detected (attempt ${attempt + 1}): ${filterResult.detectedPhrases.join(", ")}`
      );

      // Regenerate content avoiding the detected phrases
      filtered = await regenerateWithBannedPhrases(
        text,
        source.contextNote,
        source.language,
        filterResult.detectedPhrases,
        attempt
      );

      // Re-run the filter on regenerated content
      const newFilterResult = await runBannedPhraseFilter(JSON.stringify(filtered));

      if (!newFilterResult.hasBannedPhrases) {
        console.log("Regeneration successful - no banned phrases detected");
        break;
      }

      attempt++;
    }

    // Store generated content
    await storeGeneratedContent(source.id, filtered, source.language);

    // Mark source as content_generated (approval status is in generated_content table)
    await markSourceContentGenerated(source.id);
  }

  await notifyOperators();
  await logWorkflowExecution("aiml-weekly-loop");

  return {
    processed: sources.length,
    status: "complete",
  };
}
