import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IApi } from "./api";
import { User } from "src/interfaces/user.interfaces";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class ApiService implements IApi {
  private readonly logger = new Logger(ApiService.name);
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async validateUser(token: string): Promise<User> {
    
  }
}