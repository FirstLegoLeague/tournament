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
    return `Team #${this.number} ${this.name}`;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

}
