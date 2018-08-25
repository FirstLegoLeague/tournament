import { Deletable, ModalModelField } from './interfaces/modal-model'
import { Deserializable } from './interfaces/deserializable'

export class Image implements Deletable, Deserializable {

  public _id: string;
  public name: string;
  public image: string;

  deserialize (input: any) {
    Object.assign(this, input);
    return this;
  }

  id () {
    return this.name
  }

  title () {
    return this.name;
  }


}
