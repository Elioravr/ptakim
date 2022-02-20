import {useState, useEffect} from 'react';

import AddNewPetekButton from './AddNewPetekButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import Separator from './Separator'
import Loading from './Loading'
import {fetchPetekList, deletePetek} from './apiService';
import './App.css';

function App() {
  const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [petekToEdit, setPetekToEdit] = useState(null);

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

    if (!isNewPetekModalOpen) {
      setPetekToEdit(null);
    }
  }, [isNewPetekModalOpen]);

  const editPetek = (petek) => {
    setIsNewPetekModalOpen(true);
    setPetekToEdit(petek)
  }

  const deletePetekAndLoadList = (petekId) => {
    if (window.confirm('בטוח שאתה רוצה למחוק את הפתק?')) {
      deletePetek(petekId);
      loadList();
    }
  }

  return (
    <div className="App">
      <div className={`page ${isNewPetekModalOpen ? '' : 'visible'}`}>
        <div className="app-header">
          <span className="logo">Ptakim</span>
        </div>
        {isLoading ? <Loading /> :
        <>
          <AddNewPetekButton setIsNewPetekModalOpen={setIsNewPetekModalOpen} />
          <PetekList list={list} editPetek={editPetek} deletePetek={deletePetekAndLoadList} />
          <Separator emoji="🤷‍♂️" />
        </>}
      </div>
      <NewPetekModal isOpen={isNewPetekModalOpen} setIsOpen={setIsNewPetekModalOpen} list={list} petekToEdit={petekToEdit} />
    </div>
  );
}

export default App;
