import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, ObjectId } from 'mongoose';
export interface IBaseCrudService<MODEL, INPUT extends { _id }, OUTPUT> {
  toOutput(m: MODEL): Promise<OUTPUT> | OUTPUT;
  moveIntoModel(model: MODEL, i: INPUT): Promise<MODEL> | MODEL;

  fetchAll(): Promise<OUTPUT[]>;

  fetchOne(id: string | ObjectId): Promise<OUTPUT>;

  create(input: INPUT): Promise<OUTPUT>;
  edit(input: INPUT): Promise<OUTPUT>;
  remove(id: string | ObjectId): Promise<OUTPUT>;
}

export const BaseCrudServiceGenerate = <
  MODEL,
  INPUT extends { _id },
  OUTPUT,
  SEARCH
>(
  modelName: string
) => {
  abstract class BaseCrudService {
    constructor(@InjectModel(modelName) private m: Model<MODEL>) {}

    abstract toOutput(m: MODEL): Promise<OUTPUT> | OUTPUT;
    abstract moveIntoModel(model: MODEL, i: INPUT): Promise<MODEL> | MODEL;
    abstract searchParams(s: SEARCH): { [key: string]: any };

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

      newModel = (await this.moveIntoModel(
        newModel,
        input
      )) as HydratedDocument<MODEL, {}, unknown>;

      await (newModel as HydratedDocument<MODEL, {}, unknown>).save();

      return this.toOutput(newModel);
    }

    async edit(input: INPUT): Promise<OUTPUT> {
      let newModel = await this.m.findById(input._id);

      newModel = (await this.moveIntoModel(
        newModel,
        input
      )) as HydratedDocument<MODEL, {}, unknown>;

      await (newModel as HydratedDocument<MODEL, {}, unknown>).save();

      return this.toOutput(newModel);
    }

    async remove(id: string | ObjectId): Promise<OUTPUT> {
      let ac = await this.m.findById(id);
      ac = (await ac.remove()) as HydratedDocument<MODEL, {}, {}>;
      return this.toOutput(ac);
    }
  }

  return BaseCrudService;
};
