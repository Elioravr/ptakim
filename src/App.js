// @flow

import type {MixedElement} from 'react';
import type {
  OwnerPics,
  PageType,
  PetekListType,
  PetekType,
  UserType,
} from './AppTypes.flow';

import React from 'react';
import {useState, useEffect, useCallback} from 'react';
import usePrevious from 'use-previous';

import {Page} from './AppTypes.flow';
import MainButton from './MainButton';
import PetekList from './PetekList';
import moment from 'moment';
import 'moment/locale/he';
import NewPetekModal from './NewPetekModal';
import SearchPage from './SearchPage';
import StatisticsPage from './StatisticsPage';
import StoryPage from './StoryPage';
import SignInPage from './SignInPage';
import Separator from './Separator';
import Loading from './Loading';
import PermissionDenied from './PermissionDenied';
import {
  fetchPetekList,
  deletePetek,
  getCurrentUser,
  logout,
  fetchCurrentUser,
  fetchOwnerPics,
} from './apiService';
// $FlowIgnore - This module exists
import './App.scss';

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

  const loadUser = () => {
    return fetchCurrentUser().then((user) => {
      setCurrentUser(user);
    });
  };

  const loadList = useCallback(() => {
    setIsLoading(true);
    fetchPetekList()
      .then((list) => {
        list && setList(list);
        setIsLoading(false);

        return loadUser();
      })
      .then(() => {
        return fetchOwnerPics();
      })
      .then((fetchedOwnerPics) => {
        setOwnerPics(fetchedOwnerPics);
      })
      .catch(() =>
        setTimeout(() => {
          loadList();
        }, 300),
      );
  }, []);

  useEffect(() => {
    if (
      page === Page.App &&
      (Object.keys(list).length === 0 ||
        prevPage === Page.AddNewPetek ||
        (filteredList !== null && filteredList !== prevFilteredList))
    ) {
      loadList();
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

  const changeToPage = (nextPage: PageType) => {
    if (page === Page.App) {
      setLastAppScroll(currentScroll);
    }

    setPage(nextPage);
  };

  const editPetek = (petek) => {
    changeToPage(Page.AddNewPetek);
    setPetekToEdit(petek);
  };

  const deletePetekAndLoadList = (petekId) => {
    if (window.confirm('בטוח שאתה רוצה למחוק את הפתק?')) {
      deletePetek(petekId)
        .then(() => {
          loadList();
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
  };

  const searchButtonClassName = `search-button ${
    filteredList ? 'has-filter' : ''
  }`;

  return (
    <div className="App">
      <div className={`page ${page === Page.App ? 'visible' : ''}`}>
        <div className="app-header">
          <div className="user-button" onClick={handleOpenSignIn}>
            {currentUser ? (
              <>
                <div>{'ברוך הבא,'}</div>
                <div>{currentUser?.name.split(' ')[0]}</div>
              </>
            ) : (
              'התחבר'
            )}
          </div>
          <span className="logo">Ptakim</span>
          <div className="buttons-container">
            <div
              className="statistics-button page-button"
              onClick={handleOpenStory}>
              {'📚'}
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
              editPetek={editPetek}
              deletePetek={deletePetekAndLoadList}
              random={filteredList === null}
              ownerPics={ownerPics}
              filteredByOwner={filteredByOwner}
              onOwnerClick={setOwnerFilterHeader}
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
        {filteredList && (
          <div className="indicator">{Object.keys(filteredList).length}</div>
        )}
        <div className="button" onClick={handleSearchPageClick}>
          חפש
        </div>
        {filteredList && (
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
      <SignInPage page={page} setPage={setPage} />
      <PermissionDenied
        isOpen={isPermissionDenied}
        setIsOpen={setIsPermissionDenied}
      />
    </div>
  );
}

export default App;
