import { IMedia } from '../interfaces/game.interface';

const regions = ['wor', 'fr', 'us', 'ss', 'jp']

export enum MediaType {
  box2D = 'box-2d',
  box3D = 'box-3d',
  screen = 'ss',
  title = 'ss-title',
  video = 'video',
  videoNormalized = 'video-normalized',
}

function sortByRegion(a: IMedia, b: IMedia) {
  const idxA = regions.indexOf(a.region);
  const idxB = regions.indexOf(b.region);
  if (idxA < 0) {
    return 1;
  }
  if (idxB < 0) {
    return -1;
  }
  return idxA < idxB ? -1 : 1;
}

export function getMedia(medias: IMedia[], type: MediaType) {
  return medias.filter(media => media.type === type).sort(sortByRegion).shift();
}

export function getDefaultMedia(medias: IMedia[]) {
  const types = [MediaType.box2D, MediaType.box3D, MediaType.screen, MediaType.title];
  for (const type of types) {
    const media = getMedia(medias, type);
    if (media) {
      return media;
    }
  }
  return medias[0];
}
