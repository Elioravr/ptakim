// @flow

import type {OwnerPics, UserType} from './AppTypes.flow';
import type {MixedElement} from 'react';

import React from 'react';
import {useCallback, useEffect, useRef} from 'react';

const NO_OWNER_PIC_PLACEHOLDER =
  'https://erasmuscoursescroatia.com/wp-content/uploads/2015/11/no-user.jpg';

type Props = $ReadOnly<{
  isMenuOpen: boolean,
  currentUser: ?UserType,
  handleOpenSignIn: () => void,
  setIsMenuOpen: (boolean) => void,
  handleOpenStatistics: () => void,
  handleOpenStory: () => void,
  ownerPics: ?OwnerPics,
}>;

export default function AppMenu({
  isMenuOpen,
  currentUser,
  handleOpenSignIn,
  setIsMenuOpen,
  handleOpenStatistics,
  handleOpenStory,
  ownerPics,
}: Props): MixedElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const clickOutside = useCallback(
    (e: MouseEvent) => {
      if (!isMenuOpen) {
        return;
      }

      if (
        e.target instanceof Node &&
        !containerRef.current?.contains(e.target)
      ) {
        e.stopPropagation();
        setIsMenuOpen(false);
      }
    },
    [isMenuOpen, setIsMenuOpen],
  );

  useEffect(() => {
    document.addEventListener('click', clickOutside, true);

    return () => {
      document.removeEventListener('click', clickOutside, true);
    };
  }, [clickOutside]);

  const createMenuItemClick = (callback) => {
    return () => {
      setIsMenuOpen(false);
      callback();
    };
  };

  return (
    <div
      className={`app-menu ${isMenuOpen ? 'visible' : ''}`}
      ref={containerRef}>
      <span className="logo">Ptakim</span>

      <div
        className="menu-item"
        onClick={createMenuItemClick(handleOpenSignIn)}>
        {currentUser ? (
          <div className="current-user-container">
            <img
              className="user-picture"
              alt=""
              src={
                (ownerPics && ownerPics[currentUser.ownerName ?? '']) ||
                NO_OWNER_PIC_PLACEHOLDER
              }
            />
            <span>{currentUser?.name.split(' ')[0]}</span>
          </div>
        ) : (
          'התחבר'
        )}
      </div>
      <div
        className="menu-item"
        onClick={createMenuItemClick(
          handleOpenStatistics,
        )}>{`📈  סטטיסטיקות`}</div>
      <div
        className="menu-item"
        onClick={createMenuItemClick(handleOpenStory)}>{`📚  סטורי`}</div>
      <div className="close-button" onClick={() => setIsMenuOpen(false)}>
        X
      </div>
    </div>
  );
}
