import { ModalModel } from './interfaces/modal-model'
import { Deserializable } from './interfaces/deserializable'

export class Match implements ModalModel, Deserializable {

  matchId: number;
  stage: string;
  startTime: string;
  endTime: string;
  teams: number[];

  id() {
    return this.matchId;
  }

  title() {
    return `Match ${this.stage} #${this.matchId}`;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

}
