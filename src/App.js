import {useState} from 'react';

import AddNewPetekButton from './AddNewPetekButton'
import PetekList from './PetekList'
import NewPetekModal from './NewPetekModal'
import './App.css';

function App() {
  const [isNewPetekModalOpen, setIsNewPetekModalOpen] = useState(false);

  return (
    <div className="App">
      <div className="app-header">
        <span className="logo">Ptakim</span>
      </div>
      <AddNewPetekButton setIsNewPetekModalOpen={setIsNewPetekModalOpen} />
      <PetekList />
      <NewPetekModal isOpen={isNewPetekModalOpen} />
    </div>
  );
}

export default App;
