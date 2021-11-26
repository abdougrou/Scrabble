export enum FormType {
    AddForm,
    EditForm,
}

export interface FormConfig {
    formType: FormType;
    data: string;
}
