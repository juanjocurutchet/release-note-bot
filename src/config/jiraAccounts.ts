import "dotenv/config";
import { createBasicAuth } from "../utils/jiraAuth";

const email = "juanjo.curutchet78@gmail.com";
const token = process.env.JIRA_API_TOKEN_A;

if (!token) {
  throw new Error("Falta JIRA_API_TOKEN_A en el archivo .env");
}

export const jiraAccounts = [
  {
    name: "DEVELOPMENT",
    boardId: 1,
    email: "juanjo.curutchet78@gmail.com",
    apiToken: process.env.JIRA_API_TOKEN_A!,
    recipients: ["juanjo.curutchet78@gmail.com"]
  },
  {
    name: "SUPPORT",
    boardId: 9,
    email: "juanjo.curutchet78@gmail.com",
    apiToken: process.env.JIRA_API_TOKEN_A!,
    recipients: ["juanjo.curutchet78@gmail.com"]
  }
];
