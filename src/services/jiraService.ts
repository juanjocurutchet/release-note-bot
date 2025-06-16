import axios from "axios";

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
  };
}

export const getCurrentSprintIssues = async (
  account: {
    baseUrl: string;
    email: string;
    apiToken: string;
    boardId: number;
  }
): Promise<JiraIssue[]> => {
  const auth = {
    username: account.email,
    password: account.apiToken,
  };

  const sprints = await axios.get(
    `${account.baseUrl}/rest/agile/1.0/board/${account.boardId}/sprint?state=active`,
    { auth }
  );

  const currentSprintId = sprints.data.values[0].id;

  const issuesRes = await axios.get(
    `${account.baseUrl}/rest/agile/1.0/sprint/${currentSprintId}/issue`,
    { auth }
  );

  return issuesRes.data.issues;
};
