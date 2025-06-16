import cron from "node-cron";
import { isLastBusinessDay } from "./utils/isLastBusinessDay";
import { generateAndSendReleaseNote } from "./jobs/monthlyReleaseNote";

cron.schedule("0 9 * * *", async () => {
  const today = new Date();
  if (isLastBusinessDay(today)) {
    await generateAndSendReleaseNote();
  }
});

if (process.argv.includes("--manual")) {
  generateAndSendReleaseNote();
}
