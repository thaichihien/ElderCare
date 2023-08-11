import { BadRequestException } from "@nestjs/common";
import mongoose from "mongoose";

export const checkObjectIdValid = (id : string,message : string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(message);
    }
  }