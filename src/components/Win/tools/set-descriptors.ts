import { Dispatch, SetStateAction } from 'react';
import { IDescriptor } from '../interfaces/descriptor.interface';
import { getDescriptor } from './descriptors';

/**
 * Remove a descriptor by its id or the focused one and call the SetState function
 */
export function removeOneAndSetDescriptors(setDescriptors: Dispatch<SetStateAction<IDescriptor[]>>, id?: string) {
  let updated = false;
  setDescriptors(descriptors => {
    if (descriptors.length) {
      updated = true;
      const target = getDescriptor(descriptors, id);
      return descriptors.filter(descriptor => descriptor !== target);
    }
    return descriptors;
  });
  return updated;
}

export function updateStateAndSetDescriptors<T extends Partial<IDescriptor['state']>>(setDescriptors : Dispatch<SetStateAction<IDescriptor[]>>, state: T, id?: string, preCheck?: (descriptor: IDescriptor, state: T) => boolean | undefined) {
  let updated = false;
  setDescriptors(descriptors => {
    if (descriptors.length) {
      const target = getDescriptor(descriptors, id);
      if (!preCheck || preCheck(target, state)) {
        updated = true;
        return descriptors.map(descriptor => descriptor !== target ? descriptor : {...descriptor, state: {...descriptor.state, ...state}});
      }
    }
    return descriptors;
  });
  return updated;
}
