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
    const url = this.configService.get<string>("AUTH_SERVICE_URL");
    try {
      const response = await axios.post(url + {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response || response.data == undefined) {
        this.logger.error(`Response was not provided`);
        throw new BadRequestException(`Response was not provided`);
      }

      if (response.status === 401) {
        this.logger.error(`BadRequestException: ${response.data.message}`);
        throw new BadRequestException(response.data.message);
      }

      if (response.status === 200) {
        const user = response.data;
        this.logger.log(`User successfully validated`);
        return user;
      }
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Internal server error : ${error.message}`);
    }
  }
}