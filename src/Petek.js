export default ({petek}) => {
    console.log('petek', petek);
    const dateAsString = (new Date(petek.createdAt)).toLocaleDateString();
    return (
        <div className="petek-container">
            <div className="petek-owner">{petek.owner}</div>
            <div className="petek-text">{petek.content}</div>
            {petek.situation && <div className="petek-situation">{petek.situation}</div>}
            <div className="petek-time">התווסף ב: {dateAsString}</div>
        </div>
    );
}
