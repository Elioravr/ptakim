import {useState, useEffect} from 'react';

import AddNewPetekButton from './AddNewPetekButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import Separator from './Separator'
import Loading from './Loading'
import {fetchPetekList} from './apiService';
import './App.css';

function App() {
  const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [petekToEdit, setPetekToEdit] = useState(null);

  useEffect(() => {
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

    if (!isNewPetekModalOpen) {
      setPetekToEdit(null);
    }
  }, [isNewPetekModalOpen]);

  const editPetek = (petek) => {
    setIsNewPetekModalOpen(true);
    setPetekToEdit(petek)
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
          <PetekList list={list} editPetek={editPetek} />
          <Separator emoji="🤷‍♂️" />
        </>}
      </div>
      <NewPetekModal isOpen={isNewPetekModalOpen} setIsOpen={setIsNewPetekModalOpen} list={list} petekToEdit={petekToEdit} />
    </div>
  );
}

export default App;
