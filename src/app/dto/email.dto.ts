export interface EmailDto {
  to: string;
  subject: string;
  templateId: string;
  specialVariables: any;
  language?: string;
}
