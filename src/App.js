import {useState, useEffect} from 'react';

import AddNewPetekButton from './AddNewPetekButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import {fetchPetekList} from './apiService';
import './App.css';

function App() {
  const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);
  const [list, setList] = useState([]);

    useEffect(() => {
        fetchPetekList().then(list => list && setList(list));
    }, [isNewPetekModalOpen]);

  return (
    <div className="App">
      <div className="app-header">
        <span className="logo">Ptakim</span>
      </div>
      <AddNewPetekButton setIsNewPetekModalOpen={setIsNewPetekModalOpen} />
      <PetekList list={list} />
      <NewPetekModal isOpen={isNewPetekModalOpen} setIsOpen={setIsNewPetekModalOpen} list={list} />
    </div>
  );
}

export default App;
