export interface VariableExpansion {
  text: string;
  specialVariables: { [keys: string]: string };
  language?: string;
  preventRecursive?: boolean;
}
