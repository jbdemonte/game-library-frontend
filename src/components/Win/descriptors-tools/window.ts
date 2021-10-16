import { Dispatch, SetStateAction } from 'react';
import { IDescriptor } from '../interfaces/descriptor.interface';
import { getMaxPosDescriptor } from './position';

// delete the descriptor with the highest pos
export function removeMaxPosDescriptor(setDescriptors : Dispatch<SetStateAction<IDescriptor[]>>) {
  let updated = false;
  setDescriptors(descriptors => {
    if (descriptors.length) {
      updated = true;
      const descriptor = getMaxPosDescriptor(descriptors);
      return descriptors.filter(current => current !== descriptor);
    }
    return descriptors;
  });
  return updated;
}
