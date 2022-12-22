// @flow
import type {CommentType, OwnerPics} from './AppTypes.flow';
import type {MixedElement} from 'react';

import UserPicture from './UserPicture';

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
      <div className="comment-bubble">
        <div className="owner-name">{comment.user.nickname}</div>
        <div className="content">{comment.content}</div>
      </div>
    </div>
  );
}
