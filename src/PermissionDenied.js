// @flow

import type {MixedElement} from 'react';

import React, {useEffect, useState} from 'react';

type Props = $ReadOnly<{
  isOpen: boolean,
  setIsOpen: (boolean) => void,
}>;

export default function PermissionDenied({
  isOpen,
  setIsOpen,
}: Props): MixedElement {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  }, [isOpen, setIsOpen]);

  return (
    <div className={`permission-modal-overlay ${isOpen ? 'visible' : ''}`}>
      <div className="modal">
        <div>רק אליאור יכול לערוך את זה</div>
        <div className="emoji">{'🤷‍♂️'}</div>
      </div>
    </div>
  );
}
