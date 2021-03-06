// @flow

import type {MixedElement} from 'react';

import React, {useState, useEffect, useRef} from 'react';

import Separator from './Separator';
import {addNewPetek} from './apiService';
import type {
  AllCategoriesListType,
  AllOwnersListType,
  PageType,
  PetekListType,
  PetekType,
  RelatedListType,
} from './AppTypes.flow';
import {Page} from './AppTypes.flow';

type Props = $ReadOnly<{
  list: PetekListType,
  petekToEdit: ?PetekType,
  page: PageType,
  setPage: (PageType) => void,
  setIsPermissionDenied: (boolean) => void,
}>;

export default function NewPetekModal({
  list,
  petekToEdit,
  page,
  setPage,
  setIsPermissionDenied,
}: Props): MixedElement {
  const [owner, setOwner] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [situation, setSituation] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [allCategories, setAllCategories] = useState<AllCategoriesListType>({});
  const [allOwners, setAllOwners] = useState<AllOwnersListType>({});
  const [allRelated, setAllRelated] = useState<RelatedListType>({});
  const [rating, setRating] = useState<number>(0);
  const pageRef = useRef(null);
  const className = `page modal new-petek-modal-container ${
    page === 'add-petek-modal' ? 'visible' : ''
  }`;

  const clearForm = () => {
    setOwner('');
    setContent('');
    setSituation('');
    setCategory('');
    setRating(0);
    setAllRelated({});
  };

  useEffect(() => {
    const allOwners: AllOwnersListType = Object.keys(list).reduce(
      (result, currentPetekKey) => {
        const currentPetek = list[currentPetekKey];
        if (!result[currentPetek.owner]) {
          result[currentPetek.owner] = true;
        }

        return result;
      },
      {},
    );
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
  }, [list]);

  useEffect(() => {
    if (page === 'add-petek-modal') {
      pageRef?.current?.scrollTo(0, 0);
    }
  }, [page]);

  useEffect(() => {
    if (!petekToEdit) {
      return;
    }

    setOwner(petekToEdit.owner ?? '');
    setContent(petekToEdit.content ?? '');
    setSituation(petekToEdit.situation ?? '');
    setCategory(petekToEdit.category ?? '');
    setRating(petekToEdit.rating ?? 0);
    setAllRelated(petekToEdit.allRelated ?? {});
  }, [petekToEdit]);

  const handleSubmit = () => {
    const petek = {
      id: petekToEdit?.id ?? null,
      owner,
      content,
      situation,
      rating,
      category,
      allRelated: Object.keys(allRelated).length === 0 ? null : allRelated,
      createdAt: petekToEdit?.createdAt ?? new Date().toISOString(),
    };

    clearForm();
    addNewPetek(petek).catch(() => {
      setIsPermissionDenied(true);
    });
    setPage(Page.App);
  };

  const handleClose = () => {
    clearForm();
    setPage(Page.App);
  };

  const createHandleChange = (fieldName) => {
    return (e) => {
      switch (fieldName) {
        case 'owner': {
          setOwner(e.target.value);
          break;
        }
        case 'content': {
          setContent(e.target.value);
          break;
        }
        case 'situation': {
          setSituation(e.target.value);
          break;
        }
        case 'category': {
          setCategory(e.target.value);
          break;
        }
        default: {
          break;
        }
      }
    };
  };

  const createHandleOwnerClick = (newOwnerFromButton) => {
    return () => {
      if (owner === newOwnerFromButton) {
        setOwner('');
      }

      setOwner(newOwnerFromButton);
    };
  };

  const createHandleCategoryClick = (newCategoryFromButton) => {
    return () => {
      if (category === newCategoryFromButton) {
        setCategory('');
      }

      setCategory(newCategoryFromButton);
    };
  };

  const createHandleRelatedClick = (related) => {
    return () => {
      const newRelated = {...allRelated};
      if (newRelated[related]) {
        Reflect.deleteProperty(newRelated, related);
      } else {
        newRelated[related] = true;
      }

      setAllRelated(newRelated);
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

  return (
    <div className={className} ref={pageRef}>
      <div className="modal-header">
        <span>???????? ??????</span>
        <div onClick={handleClose}>x</div>
      </div>
      <div className="modal-body">
        <input
          value={owner}
          className="input"
          type="text"
          placeholder="???? ???????"
          onChange={createHandleChange('owner')}
        />
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

        <Separator emoji="????" />

        <textarea
          value={content}
          className="input long-input"
          placeholder="???? ?????????"
          onChange={createHandleChange('content')}
        />
        <textarea
          value={situation}
          className="input long-input"
          type="text"
          placeholder="?????????? ?????????????????"
          onChange={createHandleChange('situation')}
        />

        <Separator emoji="?????????????" />

        <div className="section-container relation-container">
          <div className="title">???????? ?????????????</div>
          <div className="related-list-container">
            {Object.keys(allOwners).map((owner, index) => {
              const className = `set-related-button ${
                allRelated[owner] ? 'selected' : ''
              }`;
              return (
                <div
                  key={index}
                  className={className}
                  onClick={createHandleRelatedClick(owner)}>
                  {owner}
                </div>
              );
            })}
          </div>
        </div>

        <Separator emoji="????" />

        <div className="section-container rating-container">
          <div className="title">
            {rating === 0 ? '?????? ???? ???????' : `???? ???????? ${rating} ????????????`}
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
        </div>

        <Separator emoji="????" />

        <div className="section-container">
          <div className="title">???????????????</div>
          <input
            value={category}
            className="input"
            type="text"
            placeholder="???????????????"
            onChange={createHandleChange('category')}
          />
          <div className="owners-list-container">
            {Object.keys(allCategories).map((currCategory, index) => {
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

        <div className="main-submit-button" onClick={handleSubmit}>
          ????????????? ???????? ?????????? ????
        </div>
      </div>
    </div>
  );
}
