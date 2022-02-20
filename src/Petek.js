export default ({petek, editPetek}) => {
    const dateAsString = (new Date(petek.createdAt)).toLocaleDateString();

    const handleClick = () => {
        console.log('petek', petek);
        editPetek(petek);
    }

    return (
        <div className="petek-container" onClick={handleClick}>
            <div className="petek-owner">{petek.owner}</div>
            <div className="petek-text">{petek.content}</div>
            {petek.situation && <div className="petek-situation">{petek.situation}</div>}
            {
                petek.allRelated && (
                    <div className="related-tags-container">
                        {Object.keys(petek.allRelated).map(relatedKey => <div key={relatedKey} className="related-tag">{relatedKey}</div>)}
                    </div>
                )
            }
            <div className="petek-footer">
                {petek.rating &&
                    <div className="rating-container">
                        <span>{petek.rating}</span>
                        <div className="star"></div>
                    </div>
                }
                <div className="petek-time">התווסף ב: {dateAsString}</div>
            </div>
        </div>
    );
}
