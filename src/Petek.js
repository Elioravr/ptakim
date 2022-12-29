// @flow

import type {OwnerPics, PetekType} from './AppTypes.flow';
import type {MixedElement} from 'react';

import PetekComment from './PetekComment';
import UserPicture from './UserPicture';

import moment from 'moment';
import React from 'react';

const NO_OWNER_PIC_PLACEHOLDER =
  'https://erasmuscoursescroatia.com/wp-content/uploads/2015/11/no-user.jpg';

type Props = $ReadOnly<{
  petek: PetekType,
  deletePetek?: (PetekType) => void,
  ownerPics: ?OwnerPics,
  enableScaleDown?: boolean,
  isHidden?: boolean,
  onOwnerClick?: (string) => void,
  onClick?: () => void,
  enableLastComment?: boolean,
}>;

export default function Petek({
  petek,
  deletePetek,
  ownerPics,
  enableScaleDown,
  isHidden,
  onOwnerClick,
  onClick,
  enableLastComment = true,
}: Props): MixedElement {
  const isBeforeAppTime = new Date(petek.createdAt) < new Date('2022-02-22');

  const handleClick = () => {
    if (onClick != null) {
      onClick();
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();

    if (deletePetek != null) {
      deletePetek(petek);
    }
  };

  const handleOwnerClick = (e) => {
    e.stopPropagation();

    if (onOwnerClick != null) {
      onOwnerClick(petek.owner);
    }
  };

  const dateString = isBeforeAppTime
    ? 'זמן מקורי לא ידוע (נכתב לפני האפליקציה)'
    : `${moment(petek.createdAt).fromNow()} (${moment(petek.createdAt).format(
        'l',
      )})`;

  return (
    <div
      className={`petek-container ${isHidden ? 'hidden' : ''}`}
      onClick={handleClick}
      style={enableScaleDown ? {transform: `scale(0.8)`} : {}}>
      {deletePetek && (
        <div className="delete-button" onClick={handleDeleteClick}>
          X
        </div>
      )}
      <div className="petek-owner" onClick={handleOwnerClick}>
        <UserPicture ownerName={petek.owner} ownerPics={ownerPics} />
        <div>
          {petek.owner}
          <div className="petek-time">{dateString}</div>
        </div>
      </div>
      <div className="petek-text" direction="auto">
        {petek.situation && (
          <div className="petek-situation">{`${petek.situation}`}</div>
        )}
        {petek.content.split('\n').map((line, index) => {
          // let lineWithBoldSupport = '';
          // line.split('*').map
          // Support for lines and bold
          return (
            <div dir="auto" key={`${line}-${index}`}>
              {line.split('*').map((part, index) => {
                if (index % 2 === 0) {
                  return <span key={index}>{part}</span>;
                } else {
                  return <b key={index}>{part}</b>;
                }
              })}
            </div>
          );
        })}

        {petek.photoURL != null && (
          <img className="petek-photo" src={petek.photoURL} />
        )}
      </div>
      {petek.allRelated && (
        <div className="related-tags-container">
          {Object.keys(petek.allRelated).map((relatedKey) => {
            const relatedPic = ownerPics && ownerPics[relatedKey];
            return (
              <div key={relatedKey} className="related-tag">
                <img src={relatedPic || NO_OWNER_PIC_PLACEHOLDER} />{' '}
                {relatedKey}
              </div>
            );
          })}
        </div>
      )}
      {petek.category && (
        <div className="categories-tags-container">
          <div className="category-tag">{petek.category}</div>
        </div>
      )}
      <div className="petek-footer">
        {petek.rating != null && petek.rating !== 0 && (
          <div className="rating-container">
            <span>{petek.rating}</span>
            <div className="rating-star"></div>
          </div>
        )}
        <div className="messages-count-container">
          <span>{petek.comments != null ? petek.comments.length : 0}</span>
          <img
            className="message-icon"
            alt=""
            // eslint-disable-next-line no-undef
            // src={(process.env.PUBLIC_URL ?? '') + '/message-icon.png'}
            src={'https://elasq.com/wp-content/uploads/2021/08/message-1.png'}
          />
        </div>
      </div>
      {enableLastComment && petek.comments.length > 0 ? (
        <>
          <div className="comments-preview">
            <div className="title">תגובות אחרונות</div>
            {petek.comments.length - 2 > 0 && (
              <div className="total-comments-message">
                צפה בעוד {petek.comments.length - 2} תגובות...
              </div>
            )}
            {petek.comments[petek.comments.length - 2] != null && (
              <PetekComment
                comment={petek.comments[petek.comments.length - 2]}
                ownerPics={ownerPics}
              />
            )}
            <PetekComment
              comment={petek.comments[petek.comments.length - 1]}
              ownerPics={ownerPics}
            />
          </div>
        </>
      ) : (
        enableLastComment && (
          <div className="click-to-comment">📝 לחץ כדי להוסיף תגובה</div>
        )
      )}
    </div>
  );
}
