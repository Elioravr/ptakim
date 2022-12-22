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
import UserPicture from './UserPicture';
import {fetchNotifications} from './apiService';

import moment from 'moment';
import React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';

type Props = $ReadOnly<{
  petek: ?PetekType,
  page: PageType,
  setSelectedPetek: (?PetekType) => void,
  setPage: (PageType) => void,
  ownerPics: ?OwnerPics,
  list: PetekListType,
}>;

export default function NotificationsPage({
  page,
  setPage,
  ownerPics,
  setSelectedPetek,
  list,
}: Props): MixedElement {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications().then((data) => {
      setNotifications(data);
    });
  }, [page]);

  const handleNotificationClick = useCallback(
    (notification) => {
      setPage(Page.Petek);
      setSelectedPetek(list.find((petek) => petek.id === notification.petekId));
    },
    [list, setPage, setSelectedPetek],
  );

  const notificationSorted = useMemo(() => {
    return notifications.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [notifications]);

  return (
    <PageContainer
      currPage={page}
      pageName={Page.Notifications}
      setPage={setPage}
      className="notifications-page"
      title="התראות">
      <div className="notifications-container">
        {notificationSorted.map((currentNoficiations, index) => {
          return (
            <div
              key={index}
              className="notification-container"
              onClick={() => handleNotificationClick(currentNoficiations)}>
              <UserPicture
                ownerName={currentNoficiations.ownerName}
                ownerPics={ownerPics}
              />
              <div className="notification-content">
                {currentNoficiations.content}
                <span className="date">{`${moment(
                  currentNoficiations.createdAt,
                ).fromNow()} (${moment(currentNoficiations.createdAt).format(
                  'l',
                )})`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
