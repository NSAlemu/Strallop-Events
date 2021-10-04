import {UserInterface, UserModel} from "./User.model";

export class FileModel{

  static search(data: FileInterface, filter: string) {
    return true;
  }
}

export interface FileInterface{
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  fileURL: string;
  fileName: string;
  file?: File;
  size?: number;
  createdBy: UserModel;
  updatedBy: UserModel;
}
