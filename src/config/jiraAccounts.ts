import "dotenv/config";
import { JiraAccountGroup, JiraProject } from "./jiraProjects";

const email = "juanjo.curutchet78@gmail.com";
const token = process.env.JIRA_API_TOKEN_A!;

if (!token) {
  throw new Error("Falta JIRA_API_TOKEN_A en el archivo .env");
}

export const jiraAccounts: JiraAccountGroup[] = [
  {
    name: JiraProject.VANZINI,
    dev: {
      boardId: 1,
      projectKey: "VAN",
      email,
      apiToken: token,
      baseUrl: "https://codemized.atlassian.net"
    },
    support: {
      boardId: 9,
      projectKey: "VS",
      email,
      apiToken: token,
      baseUrl: "https://codemized.atlassian.net"
    },
    recipients: ["juanjo.curutchet78@gmail.com"]
  },
  {
    name: JiraProject.GENESIS,
    dev: {
      boardId: 1,
      projectKey: "VAND",
      baseUrl: "https://codemized-team-zhkjhbgz.atlassian.net",
      email: "juanjo.curutchet78@gmail.com",
      apiToken: process.env.JIRA_API_TOKEN_A!
    },
    recipients: ["juanjo.curutchet78@gmail.com"]
  }
];
