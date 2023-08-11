import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Feedback } from './schemas/feedback.schema';
import { checkObjectIdValid } from 'src/common/exception/object-id-invalid-exception';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private feedbackModel: mongoose.Model<Feedback>,
  ) {}

  

  async create(createFeedbackDto: CreateFeedbackDto) {
    let gid = createFeedbackDto.guardian;
    let aid = createFeedbackDto.aip;

    // if (!mongoose.Types.ObjectId.isValid(gid)) {
    //   throw new BadRequestException('Invalid guardian id');
    // }

    // if (!mongoose.Types.ObjectId.isValid(aid)) {
    //   throw new BadRequestException('Invalid aip id');
    // }

    checkObjectIdValid(gid,"Invalid guardian id")
    checkObjectIdValid(aid,"Invalid aip id")


    createFeedbackDto.guardian = new mongoose.Types.ObjectId(gid);
    createFeedbackDto.aip = new mongoose.Types.ObjectId(aid);

    const created = await this.feedbackModel.create(createFeedbackDto);
    return created;
  }

  async findAll() {
    const all = await this.feedbackModel
      .find()
      .populate('guardian')
      .populate('aip');

    return all;
  }

  async findOne(id: string) {
    const one = await this.feedbackModel
      .findById(id)
      .populate('guardian')
      .populate('aip');

    return one;
  }

  async findAllFromGuardian(id: string) {
    const one = await this.feedbackModel
      .find()
      .where('guardian')
      .equals(id)
      .populate('guardian')
      .populate('aip');

    return one;
  }

  // async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {

    
  //   return `This action updates a #${id} feedback`;
  // }

  async remove(id: string) {
    return await this.feedbackModel.findByIdAndRemove(id);
  }
}
