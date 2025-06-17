export enum JiraProject {
  VANZINI = "VANZINI",
  GENESIS = "GENESIS"
}

export interface JiraSubAccount {
  boardId: number;
  projectKey: string;
  email: string;
  apiToken: string;
  baseUrl: string;
}

export interface JiraAccountGroup {
  name: JiraProject;
  dev: JiraSubAccount;
  support?: JiraSubAccount;
  recipients: string[];
}
