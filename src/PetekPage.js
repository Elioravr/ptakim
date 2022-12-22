// @flow

import type {OwnerPics, PageType, PetekType, UserType} from './AppTypes.flow';
import type {MixedElement} from 'react';

import {Page} from './AppTypes.flow';
import PageContainer from './PageContainer';
import Petek from './Petek';
import PetekComment from './PetekComment';
import Separator from './Separator';
import {addComment} from './apiService';

import React from 'react';
import {useState} from 'react';

type Props = $ReadOnly<{
  petek: ?PetekType,
  page: PageType,
  setSelectedPetek: (?PetekType) => void,
  setPage: (PageType) => void,
  ownerPics: ?OwnerPics,
  onPetekDelete: (PetekType) => void,
  onPetekEdit: (PetekType) => void,
  onOwnerClick: (string) => void,
  refetchPetek: () => void,
  currentUser: ?UserType,
  moveToRegister: () => void,
}>;

export default function PetekPage({
  page,
  setSelectedPetek,
  setPage,
  ownerPics,
  petek,
  onPetekDelete,
  onPetekEdit,
  onOwnerClick,
  refetchPetek,
  currentUser,
  moveToRegister,
}: Props): MixedElement {
  const [comment, setComment] = useState('');
  let ownerPic = '';
  if (ownerPics != null && petek != null) {
    ownerPic = ownerPics[petek.owner] ?? '';
  }

  const handleClick = () => {
    if (onPetekEdit == null || petek == null) {
      return;
    }

    onPetekEdit(petek);
  };

  const createComment = () => {
    addComment(petek, comment);
    setComment('');
    refetchPetek();
  };

  return (
    <PageContainer
      currPage={page}
      pageName={Page.Petek}
      onClose={() => setSelectedPetek(null)}
      setPage={setPage}
      className="petek-page"
      title="תגובות לפתק">
      {petek != null && (
        <>
          <Petek
            petek={petek}
            deletePetek={onPetekDelete}
            ownerPic={ownerPic}
            ownerPics={ownerPics}
            onClick={handleClick}
            onOwnerClick={onOwnerClick}
          />

          <Separator emoji="📱" />

          {petek.comments.length != 0 ? (
            Object.keys(petek.comments).map((commentKey, index) => {
              const comment = petek.comments[commentKey];

              return (
                <PetekComment
                  key={index}
                  comment={comment}
                  ownerPics={ownerPics}
                />
              );
            })
          ) : (
            <div className="empty-comments-placeholder">
              אף אחד עדיין לא הגיב על הפתק הזה 🫠
            </div>
          )}

          <div className="comment-input-container">
            {currentUser != null ? (
              <>
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="comment-input"
                  type="text"
                  placeholder="כתוב תגובה..."
                />
                <div className="submit-button" onClick={createComment}>
                  ✈️
                </div>
              </>
            ) : (
              <span className="not-connected-message">
                <span>על מנת להגיב יש </span>
                <span className="register-link" onClick={moveToRegister}>
                  להתחבר{' '}
                </span>
                <span>דרך התפריט 😎</span>
              </span>
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
}
