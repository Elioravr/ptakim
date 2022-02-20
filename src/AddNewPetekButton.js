export default ({setIsNewPetekModalOpen}) => {
    const handleClick = () => {
        setIsNewPetekModalOpen(true);
    }

    return (
        <div className="add-new-petek-button" onClick={handleClick}>
            🤦‍♂️ הוסף ציטוט 🤣
        </div>
    );
}
