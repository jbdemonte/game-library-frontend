import { IDescriptor } from '../interfaces/descriptor.interface';

export function getDescriptorById(descriptors: IDescriptor[], id: string): IDescriptor {
  const descriptor = descriptors.find(descriptor => descriptor.id === id);
  if (!descriptor) {
    throw new Error('descriptor not found');
  }
  return descriptor;
}

export function getFocusedDescriptor(descriptors: IDescriptor[]): IDescriptor {
  if (!descriptors.length) {
    throw new Error('empty descriptor list');
  }
  return descriptors.reduce((selected, descriptor) => selected.zIndex > descriptor.zIndex ? selected : descriptor);
}

export function getDescriptor(descriptors: IDescriptor[], id?: string): IDescriptor {
  return id ? getDescriptorById(descriptors, id) : getFocusedDescriptor(descriptors);
}

export function getMaxZIndex(descriptors: IDescriptor[]): number {
  return descriptors.length ? getFocusedDescriptor(descriptors).zIndex : 0;
}

/**
 * Return the descriptor list with the corresponding one updated to get the max zIndex value
 */
export function focusedDescriptor(descriptors: IDescriptor[], id: string) {
  const focused = getFocusedDescriptor(descriptors);
  if (focused.id === id) {
    return descriptors;
  }
  return descriptors.map(descriptor => descriptor.id === id ? {...descriptor, zIndex: focused.zIndex + 1} : descriptor);
}
