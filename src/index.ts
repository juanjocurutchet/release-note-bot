import "dotenv/config";
import cron from "node-cron";
import { isLastBusinessDay } from "./utils/isLastBusinessDay";
import { generateAndSendReleaseNote } from "./jobs/monthlyReleaseNote";

const args = process.argv.slice(2);
const manual = args.includes("--manual");
const sprintArg = args.find((a) => a.startsWith("--sprint="));
const sprintName = sprintArg?.split("=")[1];

if (manual) {
  console.log("Ejecutando manual con sprint:", sprintName);
  generateAndSendReleaseNote(sprintName);
} else {
  cron.schedule("0 9 * * *", async () => {
    const today = new Date();
    if (isLastBusinessDay(today)) {
      await generateAndSendReleaseNote();
    }
  });
}
