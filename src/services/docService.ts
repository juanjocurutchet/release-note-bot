import { Document, Packer, Paragraph } from "docx";

export const createReleaseNoteDocx = async (content: string): Promise<Buffer> => {
  const doc = new Document({
    sections: [{ children: [new Paragraph(content)] }],
  });

  return await Packer.toBuffer(doc);
};
