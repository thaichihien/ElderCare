import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Experience {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
