import { getSprintIssues, JiraIssue } from "../services/jiraService";
import fs from "fs";
import path from "path";
import { createReleaseNoteDocx } from "../services/docService";
import { sendReleaseNoteEmail } from "../services/emailService";
import { jiraAccounts } from "../config/jiraAccounts";

export const generateAndSendReleaseNote = async (sprintName?: string) => {
  let allDevIssues: JiraIssue[] = [];
  let allSupportIssues: JiraIssue[] = [];

  for (const account of jiraAccounts) {
    try {
      const { sprint, issues } = await getSprintIssues(account, sprintName);

      const dev = issues.filter((i: JiraIssue) => i.key.startsWith("VAN-"));
      const support = issues.filter((i: JiraIssue) => i.key.startsWith("VS-"));

      allDevIssues.push(...dev);
      allSupportIssues.push(...support);
    } catch (error) {
      console.error(`✖ Error con ${account.name}:`, error);
    }
  }

  if (allDevIssues.length === 0 && allSupportIssues.length === 0) {
    console.warn("No se encontraron issues para el sprint");
    return;
  }

  const finalSprintName = sprintName ?? "Sprint";
  const fileName = `release-note-${finalSprintName}.docx`;
  const filePath = path.join(__dirname, `../../output/${fileName}`);

  fs.mkdirSync(path.join(__dirname, "../../output"), { recursive: true });

  const docBuffer = await createReleaseNoteDocx(allDevIssues, allSupportIssues, finalSprintName);
  fs.writeFileSync(filePath, docBuffer);

  await sendReleaseNoteEmail(docBuffer, fileName, ["juanjo.curutchet78@gmail.com"]);

  console.log(`Release Note generado y enviado.`);
  console.log(`Guardado local: ${filePath}`);
};
