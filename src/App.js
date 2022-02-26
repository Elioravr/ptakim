import {useState, useEffect} from 'react';

import MainButton from './MainButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import SearchPage from './SearchPage'
import StatisticsPage from './StatisticsPage'
import SignInPage from './SignInPage'
import Separator from './Separator'
import Loading from './Loading'
import {fetchPetekList, deletePetek, getCurrentUser, logout} from './apiService';
import './App.scss';

function App() {
  // const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [petekToEdit, setPetekToEdit] = useState(null);
  const [page, setPage] = useState('app');

  const loadList = () => {
    setIsLoading(true);
    fetchPetekList()
      .then(list => {
        list && setList(list);
        setIsLoading(false);
      })
      .catch(e => fetchPetekList().then(list => {
        list && setList(list);
        setIsLoading(false);
      }));
  }

  useEffect(() => {
    loadList();

    if (page !== 'add-petek-modal') {
      setPetekToEdit(null);
    }
  }, [page]);

  const editPetek = (petek) => {
    setPage('add-petek-modal');
    setPetekToEdit(petek)
  }

  const deletePetekAndLoadList = (petekId) => {
    if (window.confirm('בטוח שאתה רוצה למחוק את הפתק?')) {
      deletePetek(petekId);
      loadList();
    }
  }

  const handleSearchPageClick = () => {
    setPage('search');
  }

  const handleOpenStatistics = () => {
    setPage('statistics');
  }

  const handleOpenSignIn = () => {
    if (getCurrentUser()) {
      if (window.confirm('בטוח שאתה רוצה להתנתק?')) {
        setIsLoading(true);
        logout().then(() => {
          setIsLoading(false);
        });
      }
    } else {
      setPage('sign-in');
    }
  }

  const clearFilter = () => {
    setFilteredList(null);
  }

  const searchButtonClassName = `search-button ${filteredList ? 'has-filter' : ''}`;

  return (
    <div className="App">
      <div className={`page ${page === 'app' ? 'visible' : ''}`}>
        <div className="app-header">
          <div className="user-button" onClick={handleOpenSignIn}>
            {getCurrentUser() ?
              "ברוך הבא"
              :
              "התחבר"
            }
          </div>
          <span className="logo">Ptakim</span>
          <div className="statistics-button" onClick={handleOpenStatistics}>{'📈'}</div>
        </div>
        {isLoading ? <Loading /> :
        <>
          <MainButton content={"🤦‍♂️ הוסף ציטוט 🤣"} onClick={() => setPage('add-petek-modal')} />
          <PetekList list={filteredList || list} editPetek={editPetek} deletePetek={deletePetekAndLoadList} random={filteredList === null} />
          <Separator emoji="🤷‍♂️" />
        </>}
      </div>
      <SearchPage page={page} setPage={setPage} list={list} setFilteredList={setFilteredList} filteredList={filteredList} />
      <NewPetekModal list={list} petekToEdit={petekToEdit} page={page} setPage={setPage} />
      <div className={searchButtonClassName}>
        {filteredList && <div className="indicator">{Object.keys(filteredList).length}</div>}
        <div className="button" onClick={handleSearchPageClick}>חפש</div>
        {filteredList && <div className="button clear-button" onClick={clearFilter}><div>נקה</div><div>חיפוש</div></div>}
      </div>
      <StatisticsPage page={page} setPage={setPage} list={list} />
      <SignInPage page={page} setPage={setPage} />
    </div>
  );
}

export default App;
