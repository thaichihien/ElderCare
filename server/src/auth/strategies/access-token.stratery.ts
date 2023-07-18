import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


type JwtPayload = {
    sub: string;
    username: string;
  };
  
@Injectable()
export class AccessTokenStratery extends PassportStrategy(Strategy,'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_SECRET
        })
    }

    validate(payload : JwtPayload){
        return payload
    }
}