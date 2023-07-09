import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      "server" : "Elder care",
      "createdAt" : "09/07/2023"
    };
  }
}
