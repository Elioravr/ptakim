// @flow
import type {OwnerPics} from './AppTypes.flow';
import type {MixedElement} from 'react';

import React from 'react';

type Props = $ReadOnly<{
  ownerName: string,
  ownerPics: ?OwnerPics,
  size: ?number,
}>;

const NO_OWNER_PIC_PLACEHOLDER =
  'https://erasmuscoursescroatia.com/wp-content/uploads/2015/11/no-user.jpg';

export default function UserPicture({
  ownerName,
  ownerPics,
  size,
}: Props): MixedElement {
  const style = {height: size, width: size};

  return (
    <div className="user-picture" style={size != null ? style : {}}>
      {ownerName === 'אליאור' ? <div className="crown">👑</div> : null}
      <img
        src={
          ownerPics != null && ownerPics[ownerName] != null
            ? ownerPics[ownerName]
            : NO_OWNER_PIC_PLACEHOLDER
        }
      />
    </div>
  );
}
