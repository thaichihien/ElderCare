import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Schema as MongooseScema} from 'mongoose'
import { Task } from "../../task/schemas/task.schema";

@Schema({
    timestamps : true
})
export class TaskImage{

    @Prop()
    link: string

    @Prop()
    latitude: number

    @Prop()
    longitude: number

    @Prop()
    address: string

    @Prop({type : Date})
    time: Date

    @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Task' })
    task: Task;
}

export const TaskImageShema = SchemaFactory.createForClass(TaskImage)