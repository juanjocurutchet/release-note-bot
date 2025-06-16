import { getCurrentSprintIssues, JiraIssue } from "../services/jiraService";
import { generateTextWithAI } from "../services/aiService";
import { createReleaseNoteDocx } from "../services/docService";
import { sendReleaseNoteEmail } from "../services/emailService";
import { jiraAccounts } from "../config/jiraAccounts";

export const generateAndSendReleaseNote = async () => {
  for (const account of jiraAccounts) {
    try {
      const issues: JiraIssue[] = await getCurrentSprintIssues(account);
      const summaries = issues.map(i => `- ${i.key}: ${i.fields.summary}`).join("\n");

      const aiContent = await generateTextWithAI(
        `Generá una release note profesional para estas tareas:\n${summaries}`
      );

      const docBuffer = await createReleaseNoteDocx(aiContent);
      await sendReleaseNoteEmail(docBuffer, `release-note-${account.name}.docx`, account.recipients);

      console.log(`✔ Release Note enviado a ${account.name}`);
    } catch (error) {
      console.error(`✖ Error con ${account.name}:`, error);
    }
  }
};
