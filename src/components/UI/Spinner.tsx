function Spinner() {
  return (
    <div
      className="spinner-border mx-auto mt-3"
      style={{ display: 'block' }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export default Spinner;
