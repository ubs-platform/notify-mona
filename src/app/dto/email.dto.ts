export interface EmailObject {
  to: string;
  subject: string;
  templateName: string;
  specialVariables: { [keys: string]: string };
}
