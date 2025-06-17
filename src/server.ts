import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { getSprintIssues } from "./services/jiraService";
import { createReleaseNoteDocx } from "./services/docService";
import { jiraAccounts } from "./config/jiraAccounts";
import { sendReleaseNoteEmail } from "./services/emailService";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

interface GenerateReleaseBody {
  devSprint: string;
  supportSprint: string;
}

app.post("/api/generate-release", async (req: Request<{}, {}, GenerateReleaseBody>, res: Response) => {
  const { devSprint, supportSprint } = req.body;

  try {
    const devAccount = jiraAccounts.find((acc) => acc.name.toUpperCase() === "DEVELOPMENT");
    const supportAccount = jiraAccounts.find((acc) => acc.name.toUpperCase() === "SUPPORT");

    if (!devAccount || !supportAccount) {
      return res.status(400).json({ error: "Faltan cuentas de Jira configuradas" });
    }

    const devData = await getSprintIssues(devAccount, devSprint);
    const supportData = await getSprintIssues(supportAccount, supportSprint);

    const buffer = await createReleaseNoteDocx(devData.issues, supportData.issues, `${devSprint}`);
    const fileName = `release-note-${devSprint}-${supportSprint}.docx`;
    const filePath = path.join(__dirname, `../output/${fileName}`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    await sendReleaseNoteEmail(
      buffer,
      fileName,
      [...devAccount.recipients, ...supportAccount.recipients]
    );
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    });

    res.send(buffer);
  } catch (error) {
    console.error(" Error al generar release:", error);
    res.status(500).json({ error: "Error al generar el release." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de release corriendo en http://localhost:${PORT}`);
});
