export default ({ onClick, content }) => {
  return (
    <div className="main-submit-button" onClick={onClick}>
      {content}
    </div>
  );
};
