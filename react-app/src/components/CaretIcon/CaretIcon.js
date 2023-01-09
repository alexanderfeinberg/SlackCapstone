import "./CaretIcon.css";

const CaretIcon = (props) => {
  return (
    <div className="caret-icon">
      {props.state && <i class="fa-solid fa-sort-down"></i>}
      {!props.state && <i class="fa-solid fa-caret-right"></i>}
    </div>
  );
};

export default CaretIcon;
