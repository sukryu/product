import { User } from "src/interfaces/user.interfaces";

export interface IApi {
  validateUser(token: string): Promise<User>;
}