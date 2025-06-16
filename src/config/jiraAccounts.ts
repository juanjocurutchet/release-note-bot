export const jiraAccounts = [
  {
    name: "CODEMIZED",
    baseUrl: "https://codemized.atlassian.net/jira/projects?page=1&sortKey=name&sortOrder=ASC&types=software",
    email: "juanjo.curutchet78@gmail.com",
    apiToken: process.env.JIRA_API_TOKEN_A!,
    boardId: 9,
    recipients: ["juanjo.curutchet78@gmail.com"],
  },
];
