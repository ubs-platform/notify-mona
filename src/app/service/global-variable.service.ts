import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GlobalVariable } from '../model/global-variable.model';
import { Model } from 'mongoose';
import { GlobalVariableWriteDTO } from '../dto/global-variable-write.dto';
import { GlobalVariableDTO } from '../dto/global-variable';
import { VariableExpansion } from '../dto/expansion-input.dto';

@Injectable()
export class GlobalVariableService {
  constructor(
    @InjectModel(GlobalVariable.name)
    public globalVariableModel: Model<GlobalVariable>
  ) {}

  toDto(a?: GlobalVariable): GlobalVariableDTO {
    if (a == null) {
      return null;
    }
    return {
      name: a.name,
      values: a.values,
    };
  }

  toDtoList(list: GlobalVariable[]): GlobalVariableDTO[] {
    return list.map((a) => {
      return this.toDto(a);
    });
  }

  async fetchAll() {
    return await this.toDtoList(await this.globalVariableModel.find().exec());
  }

  async deleteTranslation() {}

  async editOne(variable: GlobalVariableWriteDTO) {
    const existing = await this.searchOrCreateNew(variable.name);
    console.info(variable.name, variable.language, existing.values);
    existing.values[variable.language || '_'] = variable.value || undefined;
    existing.markModified('values');
    const saved = await existing.save();
    return this.toDto(saved);
  }

  async findByName(name: string) {
    return await this.globalVariableModel.findOne({
      name,
    });
  }

  async getTranslation(name: string, language?: string) {
    const exist = await this.findByName(name);
    if (exist) {
      return exist.values[language] || exist.values['_'] || name;
    }
    return name;
  }

  private async searchOrCreateNew(name: string) {
    return (
      (await this.globalVariableModel.findOne({
        name,
      })) ||
      new this.globalVariableModel({
        name,
        values: {},
      })
    );
  }

  public async apply({
    text,
    specialVariables,
    language,
    preventRecursive,
  }: VariableExpansion) {
    let textNew = text;

    // const text = 'Dear {user},  {your_need} please do not forget {your_need}';
    const variableRegex = /(\{[0-9\w]*\})/g;
    // const ac = variableRegex.exec(text);
    const matches = text.matchAll(variableRegex);
    const variableList: string[] = [];
    let variableWithCurlyPhantesisPre;
    do {
      variableWithCurlyPhantesisPre = matches.next()?.value?.[0];
      if (
        variableWithCurlyPhantesisPre &&
        !variableList.includes(variableWithCurlyPhantesisPre)
      ) {
        variableList.push(variableWithCurlyPhantesisPre);
      }
    } while (variableWithCurlyPhantesisPre != null);
    for (let index = 0; index < variableList.length; index++) {
      const variableWithCurlyPhantesis = variableList[index];
      const variableName = variableWithCurlyPhantesis.substring(
        1,
        variableWithCurlyPhantesis.length - 1
      );
      let variableValue = specialVariables[variableName];
      console.info(variableValue);
      if (!variableValue) {
        const globalVar = (await this.findByName(variableName))?.values;
        variableValue = globalVar?.[language] || globalVar?.['_'];
      }
      if (variableValue) {
        if (!preventRecursive) {
          variableValue = await this.apply({
            text: variableValue,
            specialVariables,
            language,
            preventRecursive: true,
          });
        }
        textNew = textNew
          .split(variableWithCurlyPhantesis)
          .join(`${variableValue}`);
      }
    }
    return textNew;
    // console.info(variableList);
  }
}
