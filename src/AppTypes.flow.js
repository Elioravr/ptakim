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
  comments: $ReadOnlyArray<CommentType>,
}>;

export type CommentType = $ReadOnly<{
  content: string,
  createdAt: string,
  petekId: string,
}>;

export type PetekListType = $Shape<{
  [string]: PetekType,
}>;

export type UserType = $Shape<{
  name: string,
  phoneNumber: string,
  ownerName: ?string,
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

export type StatisticsType = $ReadOnly<{
  [string | number]: number,
}>;

export type RatingPerPersonType = $ReadOnly<{
  [string]: $ReadOnly<{count: number, sum: number, average: string}>,
}>;

export type AllOwnersListType = $Shape<{[string]: boolean}>;
export type AllCategoriesListType = $Shape<{[string]: boolean}>;

export const Page = {
  App: 'app',
  AddNewPetek: 'add-petek-modal',
  Story: 'story',
  SignIn: 'sign-in',
  Statistics: 'statistics',
  Search: 'search',
  Petek: 'petek-page',
};

export type PageType =
  | 'app'
  | 'add-petek-modal'
  | 'story'
  | 'sign-in'
  | 'statistics'
  | 'search'
  | 'petek-page';

export const RatingSearch = {
  AND_ABOVE: 'and_above',
  ONLY: 'only',
};

export type RatingSearchType = 'and_above' | 'only';
