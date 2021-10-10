export interface IArchive {
  name: string;
  crc: string;
  md5: string;
  size: number;
}

export interface IGeneric {
  crc: string;
  md5: string;
  size: number;
}

export interface IFile {
  name: string;
  crc: string;
  md5: string;
  size: number;
  generic: IGeneric;
}

export interface IRom {
  id: string;
  archive: IArchive;
  files: IFile[];
}
