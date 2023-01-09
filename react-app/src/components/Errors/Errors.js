const Errors = (props) => {
  return (
    <div className="errors">
      {props.errors.map((err, idx) => (
        <div className="error" key={idx}>
          <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
          <div>{err}</div>
        </div>
      ))}
    </div>
  );
};

export default Errors;
