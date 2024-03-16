import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GlobalVariable } from '../model/global-variable.model';
import { Model } from 'mongoose';
import { GlobalVariableWriteDTO } from '../dto/global-variable.dto';
import { GlobalVariableSearchDTO } from '../dto/global-variable-search.dto';

@Injectable()
export class GlobalVariableService {
  constructor(
    @InjectModel(GlobalVariable.name)
    public globalVariableModel: Model<GlobalVariable>
  ) {}

  toDto(a?: GlobalVariable): GlobalVariableWriteDTO {
    if (a == null) {
      return null;
    }
    return {
      name: a.name,
      value: a.value,
      language: a.language,
    };
  }

  toDtoList(list: GlobalVariable[]): GlobalVariableWriteDTO[] {
    return list.map((a) => {
      return this.toDto(a);
    });
  }

  async fetchAll() {
    return await this.toDtoList(await this.globalVariableModel.find().exec());
  }

  async editOne(variable: GlobalVariableWriteDTO) {
    const existing = await this.searchOne(variable);

    existing.value = variable.value;
    const saved = await existing.save();
    return this.toDto(saved);
  }

  async search(variable: GlobalVariableSearchDTO) {
    const existing = await this.searchOne(variable);
    return this.toDto(existing);
  }

  private async searchOne(variable: GlobalVariableSearchDTO) {
    return (
      (await this.globalVariableModel.findOne({
        language: variable.language,
        name: variable.name,
      })) ||
      new this.globalVariableModel({
        language: variable.language,
        name: variable.name,
      })
    );
  }
}
