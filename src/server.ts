import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { getSprintIssues } from "./services/jiraService";
import { createReleaseNoteDocx } from "./services/docService";
import { sendReleaseNoteEmail } from "./services/emailService";
import { jiraAccounts } from "./config/jiraAccounts";
import { JiraProject } from "./config/jiraProjects";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

interface GenerateReleaseBody {
  devSprint: string;
  supportSprint: string;
  projectName: JiraProject;
}

app.post("/api/generate-release", async (req: Request<{}, {}, GenerateReleaseBody>, res: Response) => {
  const { devSprint, supportSprint, projectName } = req.body;
  console.log("🟨 projectName recibido:", projectName);
  try {
    const jiraAccount = jiraAccounts.find(
      (acc) => acc.name === projectName
    );
    console.log("🟩 Cuenta Jira encontrada:", jiraAccount?.name);
    if (!jiraAccount) {
      return res.status(400).json({ error: "Proyecto Jira no encontrado" });
    }

    const devData = await getSprintIssues(jiraAccount.dev, devSprint);
    let supportData = { issues: [] };

    if (jiraAccount.support && supportSprint) {
      supportData = await getSprintIssues(jiraAccount.support, supportSprint);
    }

    const buffer = await createReleaseNoteDocx(devData.issues, supportData.issues, devSprint, jiraAccount.name);
    const fileName = `release-note-${devSprint}-${supportSprint}.docx`;
    const filePath = path.join(__dirname, `../output/${fileName}`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);

    await sendReleaseNoteEmail(buffer, fileName, jiraAccount.recipients);

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    res.send(buffer);
  } catch (error) {
    console.error("❌ Error al generar release:", error);
    res.status(500).json({ error: "Error al generar el release." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de release corriendo en http://localhost:${PORT}`);
});
