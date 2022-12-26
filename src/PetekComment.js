// @flow
import type {CommentType, OwnerPics} from './AppTypes.flow';
import type {MixedElement} from 'react';

import UserPicture from './UserPicture';

import moment from 'moment';
import React from 'react';

type Props = $ReadOnly<{
  comment: CommentType,
  ownerPics: ?OwnerPics,
}>;

export default function PetekComment({
  comment,
  ownerPics,
}: Props): MixedElement {
  return (
    <div className="comment-container">
      <UserPicture ownerName={comment.user.nickname} ownerPics={ownerPics} />
      <div className="bubble-and-date">
        <div className="comment-bubble">
          <div className="owner-name">
            {comment.user.nickname || comment.user.commenterFullName}
          </div>
          <div className="content">{comment.content}</div>
        </div>
        <div className="date">{`${moment(
          comment.createdAt,
        ).fromNow()} (${moment(comment.createdAt).format('l')})`}</div>
      </div>
    </div>
  );
}
