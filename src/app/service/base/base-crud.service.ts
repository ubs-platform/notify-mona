import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model, ObjectId } from 'mongoose';

@Injectable()
export abstract class BaseCrudService<MODEL, INPUT extends { id }, OUTPUT> {
  constructor(private m: Model<MODEL>) {}

  abstract toOutput(m: MODEL): Promise<OUTPUT>;
  abstract moveIntoModel(model: MODEL, i: INPUT): Promise<MODEL>;

  async fetchAll(): Promise<OUTPUT[]> {
    const list = await this.m.find().exec(),
      outputList = [];
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      outputList.push(await this.toOutput(item));
    }
    return outputList;
  }

  async fetchOne(id: string | ObjectId): Promise<OUTPUT> {
    return this.toOutput(await this.m.findById(id));
  }

  async create(input: INPUT): Promise<OUTPUT> {
    let newModel = new this.m();

    newModel = (await this.moveIntoModel(newModel, input)) as HydratedDocument<
      MODEL,
      {},
      unknown
    >;

    await (newModel as HydratedDocument<MODEL, {}, unknown>).save();

    return this.toOutput(newModel);
  }

  async edit(input: INPUT): Promise<OUTPUT> {
    let newModel = await this.m.findById(input.id);

    newModel = (await this.moveIntoModel(newModel, input)) as HydratedDocument<
      MODEL,
      {},
      unknown
    >;

    await (newModel as HydratedDocument<MODEL, {}, unknown>).save();

    return this.toOutput(newModel);
  }

  async remove(id: string | ObjectId): Promise<OUTPUT> {
    let ac = await this.m.findById(id);
    ac = (await ac.remove()) as HydratedDocument<MODEL, {}, {}>;
    return this.toOutput(ac);
  }
}
