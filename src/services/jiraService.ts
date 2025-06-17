import axios from "axios";
import { JiraSubAccount } from "../config/jiraProjects";

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
  };
}

type Sprint = {
  id: number;
  name: string;
  state: string;
};

export const getSprintsFromBoard = async (
  boardId: number,
  email: string,
  apiToken: string,
  baseUrl: string
) => {
  const authHeader = Buffer.from(`${email}:${apiToken}`).toString("base64");

  const response = await axios.get(
    `${baseUrl}/rest/agile/1.0/board/${boardId}/sprint?state=active,future,closed`,
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: "application/json"
      }
    }
  );

  return response.data.values;
};

const getIssuesFromSprint = async (account: JiraSubAccount, sprintId: number) => {
  const authHeader = Buffer.from(`${account.email}:${account.apiToken}`).toString("base64");

  const response = await axios.get(
    `${account.baseUrl}/rest/agile/1.0/board/${account.boardId}/sprint/${sprintId}/issue?fields=summary,status`,
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
  account: JiraSubAccount,
  sprintNameOrId?: string
) => {
  const sprints: Sprint[] = await getSprintsFromBoard(account.boardId, account.email, account.apiToken, account.baseUrl);

  let sprint: Sprint | undefined;

  if (sprintNameOrId) {
    sprint =
      sprints.find((s) => s.name.toLowerCase() === sprintNameOrId.toLowerCase()) ||
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