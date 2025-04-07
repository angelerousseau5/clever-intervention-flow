
export interface CustomField {
  id: string;
  type: 'select' | 'input' | 'textarea';
  name: string; 
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: string;
}
