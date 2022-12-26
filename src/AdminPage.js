// @flow
import type {
  OwnerPics,
  PageType,
  PetekListType,
  PetekType,
} from './AppTypes.flow';
import type {MixedElement} from 'react';

import {Page} from './AppTypes.flow';
import PageContainer from './PageContainer';
import {
  fetchUsersMappedToPhoneNumber,
  setPhoneNumberForUser,
} from './apiService';
import useGetAllOwnersAndCategoriesFromList from './useGetAllOwnersAndCategoriesFromList';

import React from 'react';
import {useCallback, useEffect, useState} from 'react';

type Props = $ReadOnly<{
  petek: ?PetekType,
  page: PageType,
  setSelectedPetek: (?PetekType) => void,
  setPage: (PageType) => void,
  ownerPics: ?OwnerPics,
  list: PetekListType,
}>;

export default function AdminPage({page, setPage, list}: Props): MixedElement {
  const [allOwners] = useGetAllOwnersAndCategoriesFromList(list);
  const [phoneNumbers, setPhoneNumbers] = useState({});
  const [phoneNumbersFromInputs, setPhoneNumbersFromInputs] = useState({});

  useEffect(() => {
    if (page === Page.Admin) {
      fetchUsersMappedToPhoneNumber().then((data) => {
        setPhoneNumbers(data);

        Object.keys(data).forEach((phoneNumber) => {
          setPhoneNumbersFromInputs((phoneNumbersFromInputs) => ({
            ...phoneNumbersFromInputs,
            [data[phoneNumber]]: phoneNumber,
          }));
        });
      });
    }
  }, [page]);

  const createHandlePhoneNumberInputChange = useCallback(
    (ownerName) => {
      return (e) => {
        setPhoneNumbersFromInputs({
          ...phoneNumbersFromInputs,
          [ownerName]: e.target.value,
        });
      };
    },
    [phoneNumbersFromInputs],
  );

  const createHandleUpdateClick = useCallback(
    (ownerName) => {
      return () => {
        setPhoneNumberForUser(ownerName, phoneNumbersFromInputs[ownerName])
          .then(() => {
            setPage(Page.App);
          })
          .catch((e) => {
            // eslint-disable-next-line no-console
            console.log('e', e);
          });
      };
    },
    [phoneNumbersFromInputs, setPage],
  );

  return (
    <PageContainer
      currPage={page}
      pageName={Page.Admin}
      setPage={setPage}
      className="admin-page"
      title="דף מנהל">
      <div className="admin-owner-list">
        {Object.keys(allOwners).map((ownerName, index) => {
          const ownerPhoneNumber = Object.keys(phoneNumbers).find(
            (phoneNumber) => {
              return (
                phoneNumbers[phoneNumber] === ownerName &&
                phoneNumber.includes('+972')
              );
            },
          );

          return (
            <div
              key={index}
              className={`owner-item ${
                ownerPhoneNumber == null ? 'empty' : ''
              }`}>
              <div className="owner-name">{ownerName}</div>
              <div className="owner-phone-number">
                <input
                  value={phoneNumbersFromInputs[ownerName]}
                  className="input"
                  type="text"
                  placeholder="הזן מספר טלפון"
                  onChange={createHandlePhoneNumberInputChange(ownerName)}
                />
              </div>
              <div
                className="update-button"
                onClick={createHandleUpdateClick(ownerName)}>
                עדכן
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
