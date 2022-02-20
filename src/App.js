import AddNewPetekButton from './AddNewPetekButton'
import PetekList from './PetekList'
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="app-header">
        <span className="logo">Ptakim</span>
      </div>
      <AddNewPetekButton />
      <PetekList />
    </div>
  );
}

export default App;
