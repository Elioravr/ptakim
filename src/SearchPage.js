// @flow

import React, {useState, useEffect, useRef, useCallback} from 'react';

import Separator from './Separator';
import type {
  PageType,
  PetekListType,
  AllCategoriesListType,
  RelatedListType,
  RatingSearchType,
  AllOwnersListType,
} from './AppTypes.flow';
import usePrevious from 'use-previous';
import type {MixedElement} from 'react';
import {Page, RatingSearch} from './AppTypes.flow';
import PageContainer from './PageContainer';

type Props = $ReadOnly<{
  page: PageType,
  setPage: (PageType) => void,
  list: PetekListType,
  setFilteredList: (?PetekListType) => void,
  filteredList: ?PetekListType,
  setOwnerFilterHeader: (string, $Shape<{overrideList: boolean}>) => void,
}>;

export default function SearchPage({
  page,
  setPage,
  list,
  setFilteredList,
  filteredList,
  setOwnerFilterHeader,
}: Props): MixedElement {
  const [freeTextFilter, setFreeTextFilter] = useState<string>('');
  const [allOwners, setAllOwners] = useState<AllOwnersListType>({});
  const [allCategories, setAllCategories] = useState<AllCategoriesListType>({});
  const [allRelated, setAllRelated] = useState<RelatedListType>({});
  const [owner, setOwner] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [ratingSearchType, setRatingSearchType] = useState<RatingSearchType>(
    RatingSearch.AND_ABOVE,
  );
  const pageRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef(null);
  const submitButtonRef = useRef(null);
  const previousList = usePrevious(list);

  const isFilteredBySomething =
    freeTextFilter !== '' ||
    owner !== '' ||
    category !== '' ||
    Object.keys(allRelated).length !== 0 ||
    rating !== 0;

  const clearAllFilters = useCallback(() => {
    setFreeTextFilter('');
    setOwner('');
    setCategory('');
    setAllRelated({});
    setRating(0);
    setRatingSearchType(RatingSearch.AND_ABOVE);

    setFilteredList(null);
  }, [setFilteredList]);

  const search = useCallback(() => {
    let result = {...list};

    // Free text search
    if (freeTextFilter) {
      result = Object.keys(list).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (
          currentPetek.content?.includes(freeTextFilter) ||
          currentPetek.category?.includes(freeTextFilter) ||
          currentPetek.owner?.includes(freeTextFilter) ||
          (currentPetek.allRelated &&
            Object.keys(currentPetek.allRelated).includes(freeTextFilter)) ||
          currentPetek.situation?.includes(freeTextFilter)
        ) {
          filtered[currentPetekKey] = currentPetek;
        }

        return filtered;
      }, {});
    }

    // Owner
    if (owner) {
      result = Object.keys(result).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (currentPetek?.owner === owner) {
          filtered[currentPetekKey] = currentPetek;
        }

        return filtered;
      }, {});
    }

    // Related
    if (allRelated) {
      result = Object.keys(result).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (
          Object.keys(allRelated).every(
            (related) =>
              currentPetek?.allRelated &&
              Object.keys(currentPetek?.allRelated).includes(related),
          )
        ) {
          filtered[currentPetekKey] = currentPetek;
        }

        return filtered;
      }, {});
    }

    // Rating
    if (rating !== 0) {
      result = Object.keys(result).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];
        const isInRating =
          ratingSearchType === RatingSearch.AND_ABOVE
            ? currentPetek.rating >= rating
            : currentPetek.rating === rating;

        if (currentPetek?.rating != null && isInRating) {
          filtered[currentPetekKey] = currentPetek;
        }

        return filtered;
      }, {});
    }

    // Category
    if (category) {
      result = Object.keys(result).reduce((filtered, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];

        if (currentPetek?.category === category) {
          filtered[currentPetekKey] = currentPetek;
        }

        return filtered;
      }, {});
    }

    setFilteredList(result);
    setOwnerFilterHeader(owner, {overrideList: false});
  }, [
    allRelated,
    category,
    freeTextFilter,
    list,
    owner,
    rating,
    ratingSearchType,
    setFilteredList,
    setOwnerFilterHeader,
  ]);

  useEffect(() => {
    // Reset search in case the list changes (on edit for example)
    if (
      isFilteredBySomething &&
      JSON.stringify(previousList) !== JSON.stringify(list)
    ) {
      search();
    }

    const allOwners = Object.keys(list).reduce((result, currentPetekKey) => {
      const currentPetek = list[currentPetekKey];
      if (!result[currentPetek.owner]) {
        result[currentPetek.owner] = true;
      }

      return result;
    }, {});
    setAllOwners(allOwners);

    const allCategories = Object.keys(list).reduce(
      (result, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];
        if (currentPetek.category && !result[currentPetek.category]) {
          result[currentPetek.category] = true;
        }

        return result;
      },
      {},
    );
    setAllCategories(allCategories);
  }, [isFilteredBySomething, list, previousList, search]);

  useEffect(() => {
    let submitButtonPaddingBottom = 0;
    if (isFilteredBySomething) {
      const summraryElementHeight =
        summaryRef.current?.getBoundingClientRect().height ?? 0;
      const submitButtonElementHeight =
        submitButtonRef.current?.getBoundingClientRect().height ?? 0;
      submitButtonPaddingBottom =
        summraryElementHeight + submitButtonElementHeight;
    }

    if (pageRef.current != null) {
      // $FlowIgnore - Hardcode padding just for the submit button page
      pageRef.current.style = `padding-bottom: ${
        submitButtonPaddingBottom + 35
      }px`;
    }
  }, [
    freeTextFilter,
    owner,
    category,
    allRelated,
    rating,
    isFilteredBySomething,
  ]);

  useEffect(() => {
    if (page === 'search') {
      pageRef?.current?.scrollTo(0, 0);
    }
  }, [page]);

  // Used to clear all filters after clearing the filters from outside
  useEffect(() => {
    if (filteredList === null) {
      clearAllFilters();
    }
  }, [clearAllFilters, filteredList]);

  const handleSubmit = () => {
    search();
    setPage('app');
  };

  const handleFreeTextFilterChange = (e) => {
    setFreeTextFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const createHandleCategoryClick = (selected) => {
    return () => {
      setCategory(selected);
    };
  };

  const createHandleOwnerClick = (selected) => {
    return () => {
      if (selected === owner) {
        return setOwner('');
      }

      setOwner(selected);
    };
  };

  const createHandleRelatedClick = (selected) => {
    return () => {
      if (allRelated[selected]) {
        const newRelated = {...allRelated};
        Reflect.deleteProperty(newRelated, selected);
        setAllRelated(newRelated);
      } else {
        setAllRelated({...allRelated, [selected]: true});
      }
    };
  };

  const createHandleRatingClick = (selectedRating) => {
    return () => {
      if (selectedRating === rating) {
        return setRating(0);
      }

      setRating(selectedRating);
    };
  };

  const createHandleRatingSearchTypeClick = (ratingSearchType) => {
    return () => {
      setRatingSearchType(ratingSearchType);
    };
  };

  return (
    <PageContainer
      currPage={page}
      pageName={Page.Search}
      setPage={setPage}
      title="?????? ??????"
      pageRef={pageRef}
      className="search-page">
      <input
        value={freeTextFilter}
        className="input"
        type="text"
        placeholder="???????? ?????????? ????????????"
        onChange={handleFreeTextFilterChange}
      />
      <Separator emoji="????" />

      <div className="section-container">
        <div className="title">???? ???????</div>
        <div className="owners-list-container">
          {Object.keys(allOwners).map((currOwner, index) => {
            const className = `set-owner-button ${
              currOwner === owner ? 'selected' : ''
            }`;
            return (
              <div
                key={index}
                className={className}
                onClick={createHandleOwnerClick(currOwner)}>
                {currOwner}
              </div>
            );
          })}
        </div>
      </div>

      <Separator emoji="????" />

      <div className="section-container relation-container">
        <div className="title">???????? ?????????????</div>
        <div className="related-list-container">
          {Object.keys(allOwners).map((currRelated, index) => {
            const className = `set-related-button ${
              allRelated[currRelated] ? 'selected' : ''
            }`;
            return (
              <div
                key={index}
                className={className}
                onClick={createHandleRelatedClick(currRelated)}>
                {currRelated}
              </div>
            );
          })}
        </div>
      </div>

      <Separator emoji="??????" />

      <div className="section-container rating-container">
        <div className="title">
          {rating === 0
            ? '???? ???????????? ?????? ??????????'
            : `???? ${rating} ???????????? ${
                ratingSearchType === RatingSearch.AND_ABOVE ? '??????????' : ''
              }`}
        </div>
        <div className="stars-container">
          <div
            className={`star star-1 ${rating >= 1 ? 'selected' : ''}`}
            onClick={createHandleRatingClick(1)}></div>
          <div
            className={`star star-2 ${rating >= 2 ? 'selected' : ''}`}
            onClick={createHandleRatingClick(2)}></div>
          <div
            className={`star star-3 ${rating >= 3 ? 'selected' : ''}`}
            onClick={createHandleRatingClick(3)}></div>
          <div
            className={`star star-4 ${rating >= 4 ? 'selected' : ''}`}
            onClick={createHandleRatingClick(4)}></div>
          <div
            className={`star star-5 ${rating >= 5 ? 'selected' : ''}`}
            onClick={createHandleRatingClick(5)}></div>
        </div>
        <div className="rating-search-type-container">
          <div
            className={`search-type-button option-1 ${
              ratingSearchType === RatingSearch.AND_ABOVE ? 'selected' : ''
            }`}
            onClick={createHandleRatingSearchTypeClick(RatingSearch.AND_ABOVE)}>
            ??????????
          </div>
          <div
            className={`search-type-button option-2 ${
              ratingSearchType === RatingSearch.ONLY ? 'selected' : ''
            }`}
            onClick={createHandleRatingSearchTypeClick(RatingSearch.ONLY)}>
            ????
          </div>
        </div>
      </div>

      <Separator emoji="????" />

      <div className="section-container">
        <div className="title">???????????????</div>
        <div className="category-input-container">
          <input
            value={category}
            className="input"
            type="text"
            placeholder="???????? ???? ?????? ??????????????"
            onChange={handleCategoryChange}
          />
          <div
            className="clear-category-text"
            onClick={() => {
              setCategory('');
            }}>
            x
          </div>
        </div>
        <div className="owners-list-container">
          {Object.keys(allCategories)
            .filter((currCategory) => {
              return !category || currCategory.includes(category);
            })
            .map((currCategory, index) => {
              const className = `category-tag ${
                currCategory === category ? 'selected' : ''
              }`;
              return (
                <div
                  key={index}
                  className={className}
                  onClick={createHandleCategoryClick(currCategory)}>
                  {currCategory}
                </div>
              );
            })}
        </div>
      </div>

      <Separator emoji="????" />

      <div
        className={`main-submit-button filter-button ${
          isFilteredBySomething ? 'has-filter' : ''
        }`}
        onClick={handleSubmit}
        ref={submitButtonRef}>
        ????????????? ?????? ????
      </div>

      <div
        className={`filter-summary-container ${
          isFilteredBySomething ? 'visible' : ''
        }`}
        ref={summaryRef}>
        <div className="summary">
          <b>?????????? ??????:</b>
          {freeTextFilter !== '' && (
            <div>
              {'?????? ???????? ??????????: '} <span>{freeTextFilter}</span>
            </div>
          )}
          {owner !== '' && (
            <div>
              {'???? ???? ??????: '}
              <span>{owner}</span>
            </div>
          )}
          {Object.keys(allRelated).length !== 0 && (
            <div>
              {'???? ???????? ????????????: '}
              <span>{Object.keys(allRelated).join(', ')}</span>
            </div>
          )}
          {rating !== 0 && (
            <div>
              {'?????? ??????????: '}
              <span>{rating}</span>
              {ratingSearchType === RatingSearch.ONLY ? ' (????)' : ' (??????????)'}
            </div>
          )}
          {category !== '' && (
            <div>
              {'?????? ??????????????: '} <span>{category}</span>
            </div>
          )}
          <div className="clear-search-button" onClick={clearAllFilters}>
            ?????? ??????????
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
