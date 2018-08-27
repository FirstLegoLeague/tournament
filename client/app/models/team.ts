import { Editable,Deletable } from './interfaces/modal-model'
import { Deserializable } from './interfaces/deserializable'

export class Team implements Editable,Deletable, Deserializable {

  _id: string;
  name: string;
  number: number;
  affiliation: string;
  cityState: string;
  coach1: string;
  coach2: string;
  country: string;
  judginGroup: string;
  pitLocation: string;
  pitNumber: number;
  translationNeeded: boolean;

  id() {
    return this._id;
  }

  title() {
    return this.id() ? `Team #${this.number} ${this.name}` : 'New Team';
  }

  fields() {
    return [
      { display: 'Number', type: 'text', get: () => this.number, set: (value) => { this.number = value }, editable: false },
      { display: 'Name', type: 'text', get: () => this.name, set: (value) => { this.name = value } , editable: true},
      { display: 'Affiliation', type: 'text', get: () => this.affiliation, set: (value) => { this.affiliation = value }, editable: true },
    ];
  }

  body() {
    return {
      _id: this._id,
      name: this.name,
      number: Number(this.number),
      affiliation: this.affiliation,
      cityState: this.cityState,
      coach1: this.coach1,
      coach2: this.coach2,
      country: this.country
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
