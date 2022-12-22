// @flow
import type {OwnerPics} from './AppTypes.flow';
import type {MixedElement} from 'react';

import React from 'react';

type Props = $ReadOnly<{
  ownerName: string,
  ownerPics: ?OwnerPics,
}>;

const NO_OWNER_PIC_PLACEHOLDER =
  'https://erasmuscoursescroatia.com/wp-content/uploads/2015/11/no-user.jpg';

export default function UserPicture({
  ownerName,
  ownerPics,
}: Props): MixedElement {
  return (
    <div className="user-picture">
      {ownerName === 'אליאור' ? <div className="crown">👑</div> : null}
      <img
        src={
          ownerPics != null ? ownerPics[ownerName] : NO_OWNER_PIC_PLACEHOLDER
        }
      />
    </div>
  );
}
