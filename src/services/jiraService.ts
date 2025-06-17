import axios from "axios";
import { jiraAccounts } from "../config/jiraAccounts";

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
  };
}

export interface JiraAccount {
  name: string;
  boardId: number;
  email: string;
  apiToken: string;
  recipients: string[];
}

type Sprint = {
  id: number;
  name: string;
  state: string;
};

export const getSprintsFromBoard = async (boardId: number, email: string, apiToken: string) => {
  const authHeader = Buffer.from(`${email}:${apiToken}`).toString("base64");

  const response = await axios.get(
    `https://codemized.atlassian.net/rest/agile/1.0/board/${boardId}/sprint?state=active,future,closed`,
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: "application/json"
      }
    }
  );

  return response.data.values;
};

const getIssuesFromSprint = async (account: JiraAccount, sprintId: number) => {
  const authHeader = Buffer.from(`${account.email}:${account.apiToken}`).toString("base64");

  const response = await axios.get(
    `https://codemized.atlassian.net/rest/agile/1.0/board/${account.boardId}/sprint/${sprintId}/issue?fields=summary,status`,
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: "application/json"
      }
    }
  );

  return response.data.issues;
};

export const getSprintIssues = async (
  account: JiraAccount,
  sprintNameOrId?: string
) => {
  const sprints: Sprint[] = await getSprintsFromBoard(account.boardId, account.email, account.apiToken);

  let sprint: Sprint | undefined;

  if (sprintNameOrId) {
    sprint =
    sprints.find((s) => s.name.toLowerCase() === sprintNameOrId.toLowerCase())    ||
    sprints.find((s) => s.name.toLowerCase().includes(sprintNameOrId.toLowerCase())) ||
    sprints.find((s) => String(s.id) === sprintNameOrId);
  } else {
    sprint = sprints.find((s) => s.state === "active");
  }

  if (!sprint) {
    throw new Error(`No se encontró el sprint "${sprintNameOrId}" en el board ${account.boardId}`);
  }

  const issues = await getIssuesFromSprint(account, sprint.id);
  return { sprint, issues };
};

(async () => {
  try {
    const account = jiraAccounts[0];
    const { sprint, issues } = await getSprintIssues(account, "Sprint 25");

    console.log(`Sprint encontrado: ${sprint.name} (ID: ${sprint.id})`);
    console.log(`Cantidad de issues: ${issues.length}`);
    issues.forEach((issue: JiraIssue) => {
      console.log(`- ${issue.key}: ${issue.fields.summary}`);
    });
  } catch (error) {
    console.error("Error al obtener los issues del sprint:", error);
  }
})();