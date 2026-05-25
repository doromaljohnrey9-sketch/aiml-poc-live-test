async function main() {
  console.log("🚀 Triggering AIML Weekly Loop workflow via API...");
  console.log("=".repeat(50));

  try {
    const startTime = Date.now();

    // Trigger via API route (requires Next.js dev server running)
    const response = await fetch("http://localhost:3000/api/cron/weekly-loop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization if CRON_SECRET is set
        ...(process.env.CRON_SECRET ? { Authorization: `Bearer ${process.env.CRON_SECRET}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const duration = Date.now() - startTime;

    console.log("=".repeat(50));
    console.log("✅ Workflow started successfully");
    console.log(`📝 Response:`, result);
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log("📊 Check your database for generated content and distribution logs");
  } catch (error) {
    console.error("❌ Failed to start workflow:", error);
    console.error("💡 Make sure Next.js dev server is running: pnpm dev");
    process.exit(1);
  }
}

main();
