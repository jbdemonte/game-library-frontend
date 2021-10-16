import { Dispatch, SetStateAction } from 'react';
import { IDescriptor } from '../interfaces/descriptor.interface';
import { getMaxPosDescriptor } from './position';

// active search if window has the `search` option to `true`
export function setMaxPosSearching(setDescriptors : Dispatch<SetStateAction<IDescriptor[]>>, searching: boolean) {
  let updated = false;
  setDescriptors(descriptors => {
    if (descriptors.length) {
      const descriptor = getMaxPosDescriptor(descriptors);
      if (descriptor.options.search && (searching !== Boolean(descriptor.state.searching))) {
        updated = true;
        return descriptors.map(item => item === descriptor ? {...descriptor, state: {...descriptor.state, searching}} : item);
      }
    }
    return descriptors;
  });
  return updated;
}
