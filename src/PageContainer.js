// @flow

import React from 'react';

import type {MixedElement, Node} from 'react';
import type {PageType} from './AppTypes.flow';
import {Page} from './AppTypes.flow';

type Props = $ReadOnly<{
  pageName: PageType,
  currPage: PageType,
  title: string,
  setPage: (PageType) => void,
  children: Node,
  pageRef?: {|current: HTMLDivElement | null|},
  className?: string,
  onClose?: () => void,
}>;

export default function PageContainer({
  pageName,
  currPage,
  title,
  setPage,
  children,
  pageRef,
  className: additionalClassName,
  onClose,
}: Props): MixedElement {
  const handleClose = () => {
    if (onClose != null) {
      onClose();
    }

    setPage(Page.App);
  };

  const className = `page modal ${additionalClassName ?? ''} ${
    currPage === pageName ? 'visible' : ''
  }`;

  const refProp = pageRef != null ? {ref: pageRef} : {};

  return (
    <div className={className} {...refProp}>
      <div className="page-header">
        <span>{title}</span>
        <div className="close-modal-button" onClick={handleClose}>
          {'חזרה >'}
        </div>
      </div>

      {currPage === pageName && <div className="modal-body">{children}</div>}
    </div>
  );
}
