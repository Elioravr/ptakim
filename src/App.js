// @flow

import type {
  OwnerPics,
  PageType,
  PetekListType,
  PetekType,
  UserType,
} from './AppTypes.flow';
import type {MixedElement} from 'react';

// $FlowIgnore - This module exists
import AdminPage from './AdminPage';
import './App.scss';
import AppMenu from './AppMenu';
import {Page} from './AppTypes.flow';
import Loading from './Loading';
import MainButton from './MainButton';
import NewPetekModal from './NewPetekModal';
import NotificationsPage from './NotificationsPage';
import PermissionDenied from './PermissionDenied';
import PetekList from './PetekList';
import PetekPage from './PetekPage';
import SearchPage from './SearchPage';
import Separator from './Separator';
import SignInPage from './SignInPage';
import StatisticsPage from './StatisticsPage';
import StoryPage from './StoryPage';
import {
  fetchPetekList,
  deletePetek,
  getCurrentUser,
  logout,
  fetchCurrentUser,
  fetchOwnerPics,
} from './apiService';

import moment from 'moment';
import 'moment/locale/he';
import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import usePrevious from 'use-previous';

let currentScroll = 0;
moment.locale('he');

function App(): MixedElement {
  const [list, setList] = useState<PetekListType>({});
  const [filteredList, setFilteredList] = useState<?PetekListType>(null);
  const [filteredByOwner, setFilteredByOwner] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [petekToEdit, setPetekToEdit] = useState<?PetekType>(null);
  const [currentUser, setCurrentUser] = useState<?UserType>(null);
  const [ownerPics, setOwnerPics] = useState<?OwnerPics>(null);
  const [page, setPage] = useState<PageType>(Page.App);
  const [lastAppScroll, setLastAppScroll] = useState<number>(0);
  const prevPage = usePrevious<PageType>(page);
  const prevFilteredList = usePrevious<?PetekListType>(filteredList);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);
  const [selectedPetek, setSelectedPetek] = useState<?PetekType>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const loadUser = () => {
    return fetchCurrentUser().then((user) => {
      setCurrentUser(user);
    });
  };

  const changeToPage = useCallback(
    (nextPage: PageType) => {
      if (page === Page.App) {
        setLastAppScroll(currentScroll);
      }

      setPage(nextPage);
    },
    [page],
  );

  const editPetek = (petek) => {
    changeToPage(Page.AddNewPetek);
    setPetekToEdit(petek);
  };

  const deletePetekAndLoadList = (petek) => {
    if (window.confirm('בטוח שאתה רוצה למחוק את הפתק?')) {
      deletePetek(petek.id)
        .then(() => {
          loadList();
          setSelectedPetek(null);
        })
        .catch(() => {
          setIsPermissionDenied(true);
        });
    }
  };

  const handleSearchPageClick = () => {
    changeToPage(Page.Search);
  };

  const handleOpenStatistics = () => {
    changeToPage(Page.Statistics);
  };

  const handleOpenStory = () => {
    changeToPage(Page.Story);
  };

  const handleOpenNotifications = () => {
    changeToPage(Page.Notifications);
  };

  const handleOpenAdmin = () => {
    changeToPage(Page.Admin);
  };

  const handleOpenPetekPage = useCallback(() => {
    changeToPage(Page.Petek);
  }, [changeToPage]);

  const loadList = useCallback(() => {
    setIsLoading(true);
    fetchPetekList()
      .then((list) => {
        list && setList(list);

        if (selectedPetek != null) {
          setSelectedPetek(list.find((petek) => petek.id === selectedPetek.id));
        }

        setIsLoading(false);

        return loadUser();
      })
      .then(() => {
        return fetchOwnerPics();
      })
      .then((fetchedOwnerPics) => {
        setOwnerPics(fetchedOwnerPics);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log('e', e);
        setTimeout(() => {
          loadList();
        }, 300);
      });
  }, [selectedPetek]);

  useEffect(() => {
    if (
      page === Page.App &&
      (Object.keys(list).length === 0 ||
        prevPage === Page.AddNewPetek ||
        (filteredList !== null && filteredList !== prevFilteredList))
    ) {
      !isLoading && loadList();
    } else if (prevPage === Page.SignIn) {
      loadUser();
    } else if (page === Page.App) {
      window.scrollTo({top: lastAppScroll});
    }

    if (page !== Page.AddNewPetek) {
      setPetekToEdit(null);
    }

    if (page !== Page.App) {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [
    page,
    lastAppScroll,
    list,
    prevPage,
    filteredList,
    prevFilteredList,
    loadList,
    isLoading,
  ]);

  const handleScroll = useCallback(() => {
    if (page === Page.App) {
      currentScroll = window.scrollY;
    }
  }, [page]);

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      return document.removeEventListener('scroll', handleScroll);
    };
  });

  const handleOpenSignIn = () => {
    if (getCurrentUser()) {
      if (window.confirm('בטוח שאתה רוצה להתנתק?')) {
        setIsLoading(true);
        logout().then(() => {
          setIsLoading(false);
          setCurrentUser(null);
        });
      }
    } else {
      changeToPage(Page.SignIn);
    }
  };

  const handleMenuOpenClick = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const clearFilter = () => {
    setFilteredList(null);
    setFilteredByOwner(null);
  };

  const setOwnerFilterHeader = (owner, {overrideList = true} = {}) => {
    let result = {...list};

    result = Object.keys(result).reduce((filtered, currentPetekKey) => {
      const currentPetek = list[currentPetekKey];

      if (currentPetek?.owner === owner) {
        filtered[currentPetekKey] = currentPetek;
      }

      return filtered;
    }, {});

    const totalAmount = Object.keys(list).reduce((total, currentPetekId) => {
      if (list[currentPetekId].owner === owner) {
        return total + 1;
      }

      return total;
    }, 0);

    const totalRating = Object.keys(list).reduce((total, currentPetekId) => {
      if (list[currentPetekId].owner === owner) {
        return total + list[currentPetekId].rating;
      }

      return total;
    }, 0);

    if (overrideList) {
      setFilteredList(result);
    }

    setFilteredByOwner({
      owner,
      statistics: {
        totalAmount,
        averageRating: (totalRating / totalAmount).toFixed(1),
      },
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
    setPage(Page.App);

    // Clearing the selected petek in case there's one
    setSelectedPetek(null);
  };

  const searchButtonClassName = `search-button ${
    filteredList ? 'has-filter' : ''
  }`;

  return (
    <>
      <div className={`App ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className={`page ${page === Page.App ? 'visible' : ''}`}>
          <div className="app-header">
            <div className="menu-button" onClick={handleMenuOpenClick}>
              <div className="point"></div>
              <div className="point"></div>
              <div className="point"></div>
            </div>
            <span className="logo">Ptakim</span>
            <div className="buttons-container">
              <div
                className="statistics-button page-button"
                onClick={handleOpenNotifications}>
                {'🔔'}
              </div>
              <div
                className="statistics-button page-button"
                onClick={handleOpenStatistics}>
                {'📈'}
              </div>
            </div>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {!filteredList && (
                <MainButton
                  content={'🤦‍♂️ הוסף ציטוט 🤣'}
                  onClick={() => setPage(Page.AddNewPetek)}
                />
              )}
              <PetekList
                list={filteredList || list}
                random={filteredList === null}
                ownerPics={ownerPics}
                filteredByOwner={filteredByOwner}
                onOwnerClick={setOwnerFilterHeader}
                openPetekList={handleOpenPetekPage}
                setSelectedPetek={setSelectedPetek}
              />
              <Separator emoji="🤷‍♂️" />
            </>
          )}
        </div>
        <SearchPage
          page={page}
          setPage={setPage}
          list={list}
          setFilteredList={setFilteredList}
          filteredList={filteredList}
          setOwnerFilterHeader={setOwnerFilterHeader}
        />
        <NewPetekModal
          list={list}
          petekToEdit={petekToEdit}
          page={page}
          setPage={setPage}
          setIsPermissionDenied={setIsPermissionDenied}
        />
        <div className={searchButtonClassName}>
          {filteredList && selectedPetek == null && (
            <div className="indicator">{Object.keys(filteredList).length}</div>
          )}
          {selectedPetek == null && (
            <div className="button" onClick={handleSearchPageClick}>
              חפש
            </div>
          )}
          {filteredList && selectedPetek == null && (
            <div className="button clear-button" onClick={clearFilter}>
              <div>נקה</div>
              <div>חיפוש</div>
            </div>
          )}
        </div>
        <StatisticsPage
          page={page}
          setPage={setPage}
          list={list}
          onOwnerClick={setOwnerFilterHeader}
        />
        <StoryPage
          page={page}
          setPage={setPage}
          list={list}
          ownerPics={ownerPics}
        />
        <SignInPage
          page={page}
          setPage={setPage}
          handleRegisterSuccess={() => {
            if (selectedPetek != null) {
              changeToPage(Page.Petek);
            } else {
              changeToPage(Page.App);
            }
          }}
        />
        <PetekPage
          page={page}
          ownerPics={ownerPics}
          petek={selectedPetek}
          setPage={setPage}
          onPetekDelete={deletePetekAndLoadList}
          onPetekEdit={editPetek}
          setSelectedPetek={setSelectedPetek}
          onOwnerClick={setOwnerFilterHeader}
          refetchPetek={loadList}
          currentUser={currentUser}
          moveToRegister={() => {
            changeToPage(Page.SignIn);
          }}
        />
        <NotificationsPage
          page={page}
          ownerPics={ownerPics}
          petek={selectedPetek}
          setPage={setPage}
          setSelectedPetek={setSelectedPetek}
          list={list}
        />
        <AdminPage
          page={page}
          ownerPics={ownerPics}
          petek={selectedPetek}
          setPage={setPage}
          setSelectedPetek={setSelectedPetek}
          list={list}
        />
        <PermissionDenied
          isOpen={isPermissionDenied}
          setIsOpen={setIsPermissionDenied}
        />
      </div>
      <AppMenu
        currentUser={currentUser}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        handleOpenSignIn={handleOpenSignIn}
        handleOpenStatistics={handleOpenStatistics}
        handleOpenStory={handleOpenStory}
        handleOpenNotifications={handleOpenNotifications}
        handleOpenAdmin={handleOpenAdmin}
        ownerPics={ownerPics}
      />
    </>
  );
}

export default App;
