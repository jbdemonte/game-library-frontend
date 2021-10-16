import { IDescriptor } from '../interfaces/descriptor.interface';

export function getMaxPosDescriptor(descriptors: IDescriptor[]): IDescriptor {
  if (!descriptors.length) {
    throw new Error('empty descriptor list');
  }
  return descriptors.reduce((max, current) => max.pos > current.pos ? max : current);
}

export function getMaxPos(descriptors: IDescriptor[]): number {
  return descriptors.length ? getMaxPosDescriptor(descriptors).pos : 0;
}
