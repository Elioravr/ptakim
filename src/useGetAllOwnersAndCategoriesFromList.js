// @flow

import type {
  AllCategoriesListType,
  AllOwnersListType,
  PetekListType,
} from './AppTypes.flow';

import {useMemo} from 'react';

export default function useGetAllOwnersAndCategoriesFromList(
  list: PetekListType,
) {
  const allOwners: AllOwnersListType = useMemo(() => {
    return Object.keys(list).reduce((result, currentPetekKey) => {
      const currentPetek = list[currentPetekKey];
      if (!result[currentPetek.owner]) {
        result[currentPetek.owner] = true;
      }

      return result;
    }, {});
  }, [list]);

  const allCategories: AllCategoriesListType = useMemo(() => {
    return Object.keys(list).reduce((result, currentPetekKey) => {
      const currentPetek = list[currentPetekKey];
      if (currentPetek.category && !result[currentPetek.category]) {
        result[currentPetek.category] = true;
      }

      return result;
    }, {});
  }, [list]);

  return [allOwners, allCategories];
}
