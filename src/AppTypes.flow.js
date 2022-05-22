// @flow

export type PetekType = $Shape<{
  owner: string,
  rating: number,
  category: string,
  content: string,
  id: string,
  situation: string,
  createdAt: string,
}>;

export type PetekListType = $Shape<{
  [string]: PetekType,
}>;

export type UserType = $Shape<{
  name: string,
  phoneNumber: string,
}>;

export type OwnerPics = $Shape<{
  [string]: string,
}>;

export enum Page {
  App = 'app',
  AddNewPetek = 'add-petek-modal',
  Story = 'story',
  SignIn = 'sign-in',
  Statistics = 'statistics',
  Search = 'search',
}

export type PageType = Page;
