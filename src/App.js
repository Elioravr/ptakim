import {useState, useEffect} from 'react';

import AddNewPetekButton from './AddNewPetekButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import {fetchPetekList} from './apiService';
import './App.css';

function App() {
  const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);
  const [list, setList] = useState([]);
  const [petekToEdit, setPetekToEdit] = useState(null);

  useEffect(() => {
      fetchPetekList()
        .then(list => list && setList(list))
        .catch(e => fetchPetekList().then(list => list && setList(list)));
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
        <AddNewPetekButton setIsNewPetekModalOpen={setIsNewPetekModalOpen} />
        <PetekList list={list} editPetek={editPetek} />
      </div>
      <NewPetekModal isOpen={isNewPetekModalOpen} setIsOpen={setIsNewPetekModalOpen} list={list} petekToEdit={petekToEdit} />
    </div>
  );
}

export default App;
