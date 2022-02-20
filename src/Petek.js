export default ({petek, editPetek, deletePetek}) => {
    const dateAsString = (new Date(petek.createdAt)).toLocaleDateString();

    const handleClick = () => {
        console.log('petek', petek);
        editPetek(petek);
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        console.log('deletePetek', deletePetek);
        deletePetek(petek.id);
    }
    console.log('petek', petek);

    return (
        <div className="petek-container" onClick={handleClick}>
            <div className="delete-button" onClick={handleDeleteClick}>X</div>
            <div className="petek-owner">{petek.owner}</div>
            {petek.situation && <div className="petek-situation">{`— ${petek.situation}`}</div>}
            <div className="petek-text">
                {petek.content.split('\n').map(line => {
                    // let lineWithBoldSupport = '';
                    // line.split('*').map
                    // Support for lines and bold
                    return <div>{line.split('*').map((part, index) => {
                        if (index % 2 === 0) {
                            return part;
                        } else {
                            return <b>{part}</b>;
                        }
                    })}</div>;
                })}
            </div>
            {
                petek.allRelated && (
                    <div className="related-tags-container">
                        {Object.keys(petek.allRelated).map(relatedKey => <div key={relatedKey} className="related-tag">{relatedKey}</div>)}
                    </div>
                )
            }
            {
                petek.category && (
                    <div className="categories-tags-container">
                        <div className="category-tag">{petek.category}</div>
                    </div>
                )
            }
            <div className="petek-footer">
                {petek.rating != null && petek.rating !== 0 &&
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
