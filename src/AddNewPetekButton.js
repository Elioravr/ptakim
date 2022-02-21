export default ({setPage}) => {
    const handleClick = () => {
        setPage('add-petek-modal');
    }

    return (
        <div className="main-submit-button" onClick={handleClick}>
            🤦‍♂️ הוסף ציטוט 🤣
        </div>
    );
}
