import { Observable } from 'rxjs'

export type ModalModelField = { display: string, type: string, get: (entry: any) => any, set: ((entry: any, value: any) => void), editable: boolean }

export interface EditableModalService {
  save: (model: any) => Observable<any>
  fields: () => ModalModelField[]
  title: (model: any) => string
}

export interface DeletableModalService {
  delete: (model: any) => Observable<any>
  title: (model: any) => string
}
