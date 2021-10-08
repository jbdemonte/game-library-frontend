export interface ISystem {
  id: string,
  name: string,
  picture: string,
  pictures?: string[],
  icon?: string,
  icons?: string[],
  section: 'computers' |'consoles' | 'handhelds' | 'arcades' | 'others'
}
