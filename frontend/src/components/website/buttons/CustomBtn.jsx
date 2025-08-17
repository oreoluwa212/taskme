function CustomBtn(props) {
  return (
    <button onClick={props.click} className={props.className}>
      {props.btnText}
    </button>
  );
}

export default CustomBtn;
