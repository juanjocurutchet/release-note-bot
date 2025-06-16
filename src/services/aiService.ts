import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY! });
const openai = new OpenAIApi(configuration);

export const generateTextWithAI = async (prompt: string): Promise<string> => {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return response.data.choices[0].message?.content || "";
};
