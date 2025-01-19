function Buttons(props) {
  return (
    <button
      type={props.legenda === "Criar Conta" ? "submit" : "button"} // tipo submit apenas para o botão de criar conta
      className={props.style}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.legenda}
    </button>
  )
}

export default Buttons;