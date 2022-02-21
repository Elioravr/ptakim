import {useState, useEffect} from 'react';

import AddNewPetekButton from './AddNewPetekButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import SearchPage from './SearchPage'
import Separator from './Separator'
import Loading from './Loading'
import {fetchPetekList, deletePetek} from './apiService';
import './App.css';

function App() {
  // const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);
  const [list, setList] = useState([]);
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

  return (
    <div className="App">
      <div className={`page ${page === 'app' ? 'visible' : ''}`}>
        <div className="app-header">
          <span className="logo">Ptakim</span>
        </div>
        {isLoading ? <Loading /> :
        <>
          <AddNewPetekButton setPage={setPage} />
          <PetekList list={list} editPetek={editPetek} deletePetek={deletePetekAndLoadList} />
          <Separator emoji="🤷‍♂️" />
        </>}
      </div>
      <SearchPage page={page} setPage={setPage} list={list} />
      <NewPetekModal list={list} petekToEdit={petekToEdit} page={page} setPage={setPage} />
      <div className="search-button" onClick={handleSearchPageClick}>חפש</div>
    </div>
  );
}

export default App;
