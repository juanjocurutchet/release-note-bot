import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import { JiraIssue } from "./jiraService";

const buildIssueParagraph = (index: number, issue: JiraIssue) => {
  const estado = issue.fields.status?.name || "Sin estado";
  return new Paragraph({
    spacing: { after: 200, line: 360 },
    children: [
      new TextRun({ text: `${index}. `, font: "Arial", size: 24 }),
      new TextRun({ text: `${issue.key}: `, bold: true, font: "Arial", size: 24 }),
      new TextRun({ text: issue.fields.summary, font: "Arial", size: 24 }),
      new TextRun({ text: ` [${estado}]`, font: "Arial", size: 24 }),
    ],
  });
};

export const createReleaseNoteDocx = async (
  devIssues: JiraIssue[],
  supportIssues: JiraIssue[],
  sprintName: string
): Promise<Buffer> => {
  const monthsEs = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const now = new Date();
  const mes = monthsEs[now.getMonth()];
  const año = now.getFullYear();
  const devParagraphs = devIssues.map((issue, i) => buildIssueParagraph(i + 1, issue));
  const supportParagraphs = supportIssues.map((issue, i) => buildIssueParagraph(i + 1, issue));

  const darkGray = "4F4F4F";

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Release Note - Vanzini - ${mes} ${año}`,
                font: "Arial",
                size: 44,
                bold: true,
                color: darkGray,
              }),
            ],
          }),
          new Paragraph({
            border: {
              bottom: {
                color: darkGray,
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { after: 300 },
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "Desarrollo:",
                bold: true,
                font: "Arial",
                size: 32,
                color: darkGray,
              }),
            ],
          }),
          ...devParagraphs,
          new Paragraph({
            border: {
              bottom: {
                color: darkGray,
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
            spacing: { before: 400, after: 300 },
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "Soporte:",
                bold: true,
                font: "Arial",
                size: 32,
                color: darkGray,
              }),
            ],
          }),
          ...supportParagraphs,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
