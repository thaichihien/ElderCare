import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schemas/schedule.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

export interface DayShift {
  morning_shift: Schedule[];
  afternoon_shift: Schedule[];
  evening_shift: Schedule[];
}

export interface WeekShift {
  monday: DayShift;
  tuesday: DayShift;
  wednesday: DayShift;
  thursday: DayShift;
  friday: DayShift;
  saturday: DayShift;
}

@ApiTags('Schedule')
@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: mongoose.Model<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    // ! Check if id is valid

    const created = await this.scheduleModel.create(createScheduleDto);
    return created;
  }

  async findAll() {
    const all = await this.scheduleModel.find();
    return all;
  }

  async findAllAvailable() {
    const all = await this.scheduleModel.find().or([
      {
        startTime: { $gte: new Date() },
      },
      {
        isCycle: true,
      },
    ]);
    return all;
  }

  async findOne(id: string) {
    const one = await this.scheduleModel.findById(id);
    return one;
  }

  async findScheduleOfGuardian(
    id: string,
    date: string,
  ): Promise<Schedule[] | DayShift> {
    let schedules: Schedule[];

    if (date) {
      let scheduleADay: DayShift = {
        morning_shift: [],
        afternoon_shift: [],
        evening_shift: [],
      };
      const startDateSearch = new Date(date);
      const endDateSearch = new Date(date);

      if (!startDateSearch.valueOf()) {
        throw new BadRequestException('invalid date format');
      }
      startDateSearch.setHours(1, 0, 0);
      endDateSearch.setHours(23, 59, 0);

      schedules = await this.scheduleModel.find().and([
        { guardian: id },
        {
          $or: [
            { isCycle: true },
            {
              startTime: {
                $gte: startDateSearch.getTime(),
                $lte: endDateSearch.getTime(),
              },
            },
          ],
        },
      ]);
      // .where('guardian')
      // .equals(id)
      // .where('startTime')
      // .gte(startDateSearch.getTime())
      // .lte(endDateSearch.getTime());

      // for (let index = 0; index < schedules.length; index++) {
      //   const element = schedules[index];
      //   const dayShift = new Date(element.startTime);

      //   if (
      //     element.isCycle &&
      //     dayShift.getDay() != startDateSearch.getDay()
      //   ) {
      //     continue;
      //   }

      //   this.arrangeDayShift(dayShift.getHours(), scheduleADay, element);
      // }

      for (const element of schedules) {
        const dayShift = new Date(element.startTime);

        if (element.isCycle && dayShift.getDay() != startDateSearch.getDay()) {
          continue;
        }

        this.arrangeDayShift(dayShift.getHours(), scheduleADay, element);
      }

      return scheduleADay;
    } else {
      schedules = await this.scheduleModel.find().where('guardian').equals(id);
    }

    return schedules;
  }

  arrangeDayShift(h: number, scheduleADay: DayShift, element: Schedule) {
    if (h >= 7 && h < 11) {
      scheduleADay.morning_shift.push(element);
    } else if (h >= 13 && h < 17) {
      scheduleADay.afternoon_shift.push(element);
    } else if (h >= 17 && h < 21) {
      scheduleADay.evening_shift.push(element);
    }
  }

  arrangeWeekShift(
    d: number,
    h: number,
    scheduleShift: WeekShift,
    element: Schedule,
  ) {
    switch (d) {
      case 1:
        this.arrangeDayShift(h, scheduleShift.monday, element);
        break;
      case 2:
        this.arrangeDayShift(h, scheduleShift.tuesday, element);
        break;
      case 3:
        this.arrangeDayShift(h, scheduleShift.wednesday, element);
        break;
      case 4:
        this.arrangeDayShift(h, scheduleShift.thursday, element);
        break;
      case 5:
        this.arrangeDayShift(h, scheduleShift.friday, element);
        break;
      case 6:
        this.arrangeDayShift(h, scheduleShift.saturday, element);
        break;
      default:
        break;
    }
  }

  async findScheduleOfGuardianCurrentWeek(id: string, date: string) {
    let selectedDate: Date;
    if (date) {
      selectedDate = new Date(date);
    } else {
      selectedDate = new Date();
    }

    if (!selectedDate.valueOf()) {
      throw new BadRequestException('invalid date format');
    }

    const week = this.getFirstDayAndLastDayOfWeek(selectedDate);
    const weekShift: WeekShift = {
      monday: {
        morning_shift: [],
        afternoon_shift: [],
        evening_shift: [],
      },
      tuesday: {
        morning_shift: [],
        afternoon_shift: [],
        evening_shift: [],
      },
      wednesday: {
        morning_shift: [],
        afternoon_shift: [],
        evening_shift: [],
      },
      thursday: {
        morning_shift: [],
        afternoon_shift: [],
        evening_shift: [],
      },
      friday: {
        morning_shift: [],
        afternoon_shift: [],
        evening_shift: [],
      },
      saturday: {
        morning_shift: [],
        afternoon_shift: [],
        evening_shift: [],
      },
    };

    const schedules = await this.scheduleModel.find().and([
      { guardian: id },
      {
        $or: [
          { isCycle: true },
          {
            startTime: {
              $gte: week.firstDay.getTime(),
              $lte: week.lastDay.getTime(),
            },
          },
        ],
      },
    ]);

    // const schedules = await this.scheduleModel
    //   .find()
    //   .where('guardian')
    //   .equals(id)
    //   .where('startTime')
    //   .gte(week.firstDay.getTime())
    //   .lte(week.lastDay.getTime());

    for (const element of schedules) {
      const dateShift = new Date(element.startTime);
      this.arrangeWeekShift(
        dateShift.getDay(),
        dateShift.getHours(),
        weekShift,
        element,
      );
    }

    return weekShift;
  }

  getFirstDayAndLastDayOfWeek(d: string | Date) {
    // 👇️ clone date object, so we don't mutate it
    const date = new Date(d);
    const day = date.getDay(); // 👉️ get day of week

    // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const firstDay = new Date(date.setDate(diff));
    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 6);

    firstDay.setHours(1, 0, 0);
    lastDay.setHours(23, 59, 0);

    return { firstDay, lastDay };
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const updated = await this.scheduleModel.findByIdAndUpdate(
      id,
      updateScheduleDto,
      {
        new: true,
      },
    );
    return updated;
  }

  async remove(id: string) {
    return await this.scheduleModel.findByIdAndDelete(id);
  }
}
