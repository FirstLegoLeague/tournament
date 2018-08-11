import { Editable, Deletable } from './interfaces/modal-model'
import { Deserializable } from './interfaces/deserializable'

export class Table implements Editable, Deletable, Deserializable {

  _id: string;
  tableId: number;
  tableName: string;

  id() {
    return this.tableId;
  }

  title() {
    return this.id() ? this.tableName : 'New table';
  }

  fields() {
    return [{ display: 'Name', type: 'text', get: () => this.tableName, set: (value) => { this.tableName = value } }];
  }

  body() {
    return {
      tableName: this.tableName,
      tableId: Number(this.tableId)
    };
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

  savedInDB() {
    return !!this._id;
  }

}
