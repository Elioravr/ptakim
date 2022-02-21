export default ({setPage}) => {
    const handleClick = () => {
        setPage('add-petek-modal');
    }

    return (
        <div className="add-new-petek-button" onClick={handleClick}>
            🤦‍♂️ הוסף ציטוט 🤣
        </div>
    );
}
