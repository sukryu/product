import { User } from "src/interfaces/user.interfaces";

export interface IApi {
  validateUser(userId: number): Promise<User>;
}