import { IDescriptor } from '../interfaces/descriptor.interface';
import { getMaxPosDescriptor } from '../descriptors-tools/position';

// update corresponding descriptor pos to get the highest pos
export function setMaxPosTo(descriptors: IDescriptor[], id: string) {
  const focused = getMaxPosDescriptor(descriptors);
  if (focused.id === id) {
    return descriptors;
  }
  const max = focused.pos;
  return descriptors.map(descriptor => descriptor.id === id ? {...descriptor, pos: max + 1} : descriptor);
}
