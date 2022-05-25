// @flow

import React, {useState, useEffect} from 'react';
import useRandomList from './useRandomList';
import Petek from './Petek';
import Separator from './Separator';
import type {
  FilteredByOwnerDetailsType,
  OwnerPics,
  PetekListType,
  PetekType,
} from './AppTypes.flow';
import type {MixedElement} from 'react';

const NO_OWNER_PIC_PLACEHOLDER =
  'https://erasmuscoursescroatia.com/wp-content/uploads/2015/11/no-user.jpg';

type Props = $ReadOnly<{
  list: PetekListType,
  editPetek: (PetekType) => void,
  deletePetek: (string) => void,
  random: boolean,
  ownerPics: ?OwnerPics,
  filteredByOwner: ?FilteredByOwnerDetailsType,
  onOwnerClick: (string) => void,
}>;

export default function PetekList({
  list,
  editPetek,
  deletePetek,
  random = false,
  ownerPics,
  filteredByOwner,
  onOwnerClick,
}: Props): MixedElement {
  // const [listToDisplay, setListToDisplay] = useState([]);
  // useEffect(() => {
  //     const sortedList = Object.keys(list)
  //         .sort((a, b) => {
  //             if (random) {
  //                 // console.log('random!');
  //                 return 0.5 - Math.random();
  //             }

  //             // console.log('not random!');
  //             return (new Date(list[b].createdAt)) - (new Date(list[a].createdAt));
  //         });

  //     setListToDisplay(sortedList);
  // }, [random, list]);

  const [listToDisplay] = useRandomList(list, random);
  const mainOwnerPic =
    ownerPics && filteredByOwner?.owner
      ? ownerPics[filteredByOwner?.owner]
      : null;

  return (
    <>
      {filteredByOwner?.owner && (
        <>
          <div className="filtered-by-owner-container">
            <div className="picture">
              {filteredByOwner.owner === 'אליאור' ? (
                <div className="crown">👑</div>
              ) : null}
              <img src={mainOwnerPic || NO_OWNER_PIC_PLACEHOLDER} />
            </div>
            <div className="name">{filteredByOwner.owner}</div>
            <div className="statistics">
              <div className="statistics-item">{`בסך הכל ${filteredByOwner.statistics.totalAmount} פתקים`}</div>
              <div className="statistics-item">{`ציון ממוצע: ${filteredByOwner.statistics.averageRating} ⭐️`}</div>
            </div>
          </div>
          <Separator emoji={'🤩'} />
        </>
      )}
      <div className="petek-list-container">
        {listToDisplay.map((petekKey, index) => {
          const ownerPic =
            ownerPics && list[petekKey]
              ? ownerPics[list[petekKey].owner]
              : null;
          return (
            list[petekKey] && (
              <Petek
                key={index}
                petek={{...list[petekKey], id: petekKey}}
                editPetek={editPetek}
                deletePetek={deletePetek}
                ownerPic={ownerPic}
                ownerPics={ownerPics}
                onOwnerClick={onOwnerClick}
              />
            )
          );
        })}
      </div>
    </>
  );
}
