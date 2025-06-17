export function createBasicAuth(email: string, apiToken: string): string {
  return Buffer.from(`${email}:${apiToken}`).toString("base64");
}
