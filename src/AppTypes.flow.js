// @flow

export type RelatedListType = $Shape<{
  [string]: boolean,
}>;

export type PetekType = $Shape<{
  id: string,
  owner: string,
  rating: number,
  category: string,
  content: string,
  id: string,
  situation: string,
  createdAt: string,
  allRelated: RelatedListType,
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

export type FilteredByOwnerDetailsType = $ReadOnly<{
  owner: string,
  statistics: $ReadOnly<{
    totalAmount: number,
    averageRating: string,
  }>,
}>;

export const Page = {
  App: 'app',
  AddNewPetek: 'add-petek-modal',
  Story: 'story',
  SignIn: 'sign-in',
  Statistics: 'statistics',
  Search: 'search',
};

export type PageType =
  | 'app'
  | 'add-petek-modal'
  | 'story'
  | 'sign-in'
  | 'statistics'
  | 'search';
