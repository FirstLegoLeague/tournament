import { Observable } from 'rxjs';

export type ModalModelField = { display: string, type: string, get: () => any, set: (value: any) => void }

export interface ModalModel {
  id(): number;
  fields(): ModalModelField[];
  body(): any;
  title(): string;
}

export interface ModalModelService {
  save: (model: ModalModel) => Observable<any>,
  delete: (id: number) => Observable<any>
}
