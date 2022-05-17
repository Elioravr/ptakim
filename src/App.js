// @flow

import {useState, useEffect, useCallback} from 'react';
import usePrevious from 'use-previous';

import MainButton from './MainButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import SearchPage from './SearchPage'
import StatisticsPage from './StatisticsPage'
import StoryPage from './StoryPage'
import SignInPage from './SignInPage'
import Separator from './Separator'
import Loading from './Loading'
import PermissionDenied from './PermissionDenied'
import {fetchPetekList, deletePetek, getCurrentUser, logout, fetchCurrentUser, fetchOwnerPics} from './apiService';
import './App.scss';
import { setCurrentScreen } from 'firebase/analytics';

const PAGE_ANIMATION_DELAY = 300;
let currentScroll = 0;

function App() {
  // const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(null);
  const [filteredByOwner, setFilteredByOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [petekToEdit, setPetekToEdit] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [ownerPics, setOwnerPics] = useState(null);
  const [page, setPage] = useState('app');
  const [lastAppScroll, setLastAppScroll] = useState(0);
  const prevPage = usePrevious(page);
  const prevFilteredList = usePrevious(filteredList);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const loadList = () => {
    setIsLoading(true);
    fetchPetekList()
      .then(list => {
        list && setList(list);
        setIsLoading(false);

        return fetchCurrentUser();
      })
      .then((user) => {
        setCurrentUser(user);
        return fetchOwnerPics();
      })
      .then((fetchedOwnerPics) => {
        setOwnerPics(fetchedOwnerPics);
      })
      .catch(e => setTimeout(() => {
        console.log('trying again!');
        loadList()
      }, 300));
  }

  // useEffect(() => {
  // }, [setCurrentUser])

  useEffect(() => {
    if (page === 'app' &&
        (list.length === 0 || prevPage === 'add-petek-modal' || (filteredList !== null && filteredList !== prevFilteredList))) {
      loadList();
    } else if (page === 'app') {
      window.scrollTo({top: lastAppScroll});
    }

    if (page !== 'add-petek-modal') {
      setPetekToEdit(null);
    }

    if (page !== 'app') {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [page, lastAppScroll]);

  const handleScroll = useCallback((e) => {
    if (page === 'app') {
      currentScroll = window.scrollY;
    }
  }, [page])

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => {
      return document.removeEventListener('scroll', handleScroll);
    }
  });

  const changeToPage = (nextPage) => {
    if (page === 'app') {
      setLastAppScroll(currentScroll);
    }

    setPage(nextPage);
  }

  const editPetek = (petek) => {
    changeToPage('add-petek-modal');
    setPetekToEdit(petek)
  }

  const deletePetekAndLoadList = (petekId) => {
    if (window.confirm('בטוח שאתה רוצה למחוק את הפתק?')) {
      deletePetek(petekId)
        .then(() => {
          loadList();
        }).catch(e => {
          setIsPermissionDenied(true);
        });
    }
  }

  const handleSearchPageClick = () => {
    changeToPage('search');
  }

  const handleOpenStatistics = () => {
    changeToPage('statistics');
  }

  const handleOpenStory = () => {
    changeToPage('story');
  }

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
      changeToPage('sign-in');
    }
  }

  const clearFilter = () => {
    setFilteredList(null);
    setFilteredByOwner(null);
  }

  const setOwnerFilterHeader = (owner, {overrideList=true} = {}) => {
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

    setFilteredByOwner({owner, statistics: {
      totalAmount,
      averageRating: (totalRating / totalAmount).toFixed(1)
    }});
    setPage('app');
  }

  const searchButtonClassName = `search-button ${filteredList ? 'has-filter' : ''}`;

  return (
    <div className="App">
      <div className={`page ${page === 'app' ? 'visible' : ''}`}>
        <div className="app-header">
          <div className="user-button" onClick={handleOpenSignIn}>
            {currentUser ?
              <><div>{"ברוך הבא,"}</div><div>{currentUser?.name.split(' ')[0]}</div></>
              :
              "התחבר"
            }
          </div>
          <span className="logo">Ptakim</span>
          <div className="buttons-container">
            <div className="statistics-button page-button" onClick={handleOpenStory}>{'📚'}</div>
            <div className="statistics-button page-button" onClick={handleOpenStatistics}>{'📈'}</div>
          </div>
        </div>
        {isLoading ? <Loading /> :
        <>
          {!filteredList && <MainButton content={"🤦‍♂️ הוסף ציטוט 🤣"} onClick={() => setPage('add-petek-modal')} />}
          <PetekList list={filteredList || list} editPetek={editPetek} deletePetek={deletePetekAndLoadList} random={filteredList === null} ownerPics={ownerPics} filteredByOwner={filteredByOwner} onOwnerClick={setOwnerFilterHeader} />
          <Separator emoji="🤷‍♂️" />
        </>}
      </div>
      <SearchPage page={page} setPage={setPage} list={list} setFilteredList={setFilteredList} filteredList={filteredList} setOwnerFilterHeader={setOwnerFilterHeader} />
      <NewPetekModal list={list} petekToEdit={petekToEdit} page={page} setPage={setPage} setIsPermissionDenied={setIsPermissionDenied} />
      <div className={searchButtonClassName}>
        {filteredList && <div className="indicator">{Object.keys(filteredList).length}</div>}
        <div className="button" onClick={handleSearchPageClick}>חפש</div>
        {filteredList && <div className="button clear-button" onClick={clearFilter}><div>נקה</div><div>חיפוש</div></div>}
      </div>
      <StatisticsPage page={page} setPage={setPage} list={list} onOwnerClick={setOwnerFilterHeader} />
      <StoryPage page={page} setPage={setPage} list={list} ownerPics={ownerPics} />
      <SignInPage page={page} setPage={setPage} />
      <PermissionDenied isOpen={isPermissionDenied} setIsOpen={setIsPermissionDenied} />
    </div>
  );
}

export default App;
