// @flow

import type {OwnerPics, PageType, PetekType} from './AppTypes.flow';
import type {MixedElement} from 'react';

import {Page} from './AppTypes.flow';
import PageContainer from './PageContainer';

import Petek from './Petek';

import Separator from './Separator';

import React from 'react';

type Props = $ReadOnly<{
  petek: ?PetekType,
  page: PageType,
  setSelectedPetek: (?PetekType) => void,
  setPage: (PageType) => void,
  ownerPics: ?OwnerPics,
  onPetekDelete: (PetekType) => void,
  onPetekEdit: (PetekType) => void,
  onOwnerClick: (string) => void,
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
}: Props): MixedElement {
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

          <div className="coming-soon">
            בקרוב תוכלו להגיב על פתקים... {'😱'}
          </div>

          <div className="comment-input-container">
            <input className="comment-input" type="text" />
          </div>
        </>
      )}
    </PageContainer>
  );
}
