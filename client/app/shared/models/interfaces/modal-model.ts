import { Observable } from 'rxjs'

export type ModalModelField = { display: string, type: string, get: () => any, set: ((value: any) => void), editable: boolean }

export interface Deletable {
  id (): any;
  title (): string;
}

export interface Editable {
  id (): string;
  savedInDB (): boolean;
  fields (): ModalModelField[];
  body (): any;
  title (): string;
}

export interface EditableModalService {
  save: (model: Editable) => Observable<any>
}

export interface DeletableModalService {
  delete: (id: any) => Observable<any>
  deleteErrorText: () => string
}

