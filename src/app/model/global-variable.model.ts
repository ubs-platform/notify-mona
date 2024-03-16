import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class GlobalVariable {
  _id: String;

  @Prop()
  name: String;

  @Prop()
  language: String;

  @Prop()
  value: String;
}

export const GlobalVariableSchema =
  SchemaFactory.createForClass(GlobalVariable);
