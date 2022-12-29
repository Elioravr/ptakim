// @flow
import type {OwnerPics, PetekListType} from './AppTypes.flow';
import type {MixedElement} from 'react';

import UserPicture from './UserPicture';

import React from 'react';
import {useCallback, useMemo} from 'react';

type Props = $ReadOnly<{
  list: PetekListType,
  ownerPics: ?OwnerPics,
  setFilteredList: (?PetekListType) => void,
}>;

function CommentsSummary({
  list,
  ownerPics,
  setFilteredList,
}: Props): MixedElement {
  const commentsByOwnerName = useMemo(() => {
    const commentsByUserIDs = Object.keys(list).reduce(
      (result, currentPetekId) => {
        const petek = list[currentPetekId];
        petek.comments.forEach((comment) => {
          if (result[comment.userId] == null) {
            return (result[comment.userId] = [comment]);
          }
          result[comment.userId].push(comment);
        });
        return result;
      },
      {},
    );

    const commentsByOwnerName = Object.keys(commentsByUserIDs).reduce(
      (result, currentUserId) => {
        result.push({
          ownerName: commentsByUserIDs[currentUserId][0].user.nickname,
          commentsQuantity: commentsByUserIDs[currentUserId].length,
        });

        return result;
      },
      [],
    );

    commentsByOwnerName.sort((a, b) => {
      return b.commentsQuantity - a.commentsQuantity;
    });

    return commentsByOwnerName;
  }, [list]);

  const createHandleOwnerClick = useCallback(
    (ownerName) => {
      return () => {
        const result = Object.keys(list).reduce((filtered, currentPetekKey) => {
          const currentPetek = list[currentPetekKey];

          if (
            currentPetek?.comments &&
            currentPetek?.comments.find(
              (comment) => comment.user.nickname === ownerName,
            ) != null
          ) {
            filtered[currentPetekKey] = currentPetek;
          }

          return filtered;
        }, {});

        setFilteredList(result);
      };
    },
    [list, setFilteredList],
  );

  return (
    <div className="comments-summary">
      {commentsByOwnerName.map(({ownerName, commentsQuantity}) => {
        return (
          <div
            className="comment-summary-item-container"
            key={`comment-summary-item-${ownerName}`}
            onClick={createHandleOwnerClick(ownerName)}>
            <div className="comment-summary-item">
              <UserPicture ownerName={ownerName} ownerPics={ownerPics} />
            </div>
            <div className="owner-name">{ownerName}</div>
            <div className="comments-length">{commentsQuantity} תגובות</div>
          </div>
        );
      })}
    </div>
  );
}

export default CommentsSummary;
