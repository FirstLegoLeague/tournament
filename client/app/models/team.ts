import { ModalModel } from './interfaces/modal-model'
import { Deserializable } from './interfaces/deserializable'

export class Team implements ModalModel, Deserializable {

  _id: string;
  name: string;
  number: number;
  affiliation: string;
  cityState: number;
  coach1: string;
  coach2: string;
  country: string;
  judginGroup: number;
  pitLocation: string;
  pitNumber: number;
  translationNeeded: boolean;

  id() {
    return this.number;
  }

  title() {
    return this.id() ? `Team #${this.number} ${this.name}` : 'New Team';
  }

  fields() {
    return [
      { display: 'Name', type: 'text', get: () => this.name, set: (value) => { this.name = value } },
      { display: 'Number', type: 'text', get: () => this.number, set: (value) => { this.number = value } },
      { display: 'Affiliation', type: 'text', get: () => this.affiliation, set: (value) => { this.affiliation = value } },
      { display: 'City/State', type: 'text', get: () => this.cityState, set: (value) => { this.cityState = value } },
      { display: 'Coach 1', type: 'text', get: () => this.coach1, set: (value) => { this.coach1 = value } },
      { display: 'Coach 2', type: 'text', get: () => this.coach2, set: (value) => { this.coach2 = value } },
      { display: 'Country', type: 'text', get: () => this.country, set: (value) => { this.country = value } }
    ];
  }

  body() {
    return {
      name: this.name,
      number: this.number,
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

}
