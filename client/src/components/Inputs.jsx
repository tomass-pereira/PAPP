function Inputs(props) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium mb-2">
        {props.label}
      </label>
      <input
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        className={props.style}
        value={props.value}
        disabled={props.disabled}
        onChange={props.onChange}
        maxLength={props.id === "codpostal" ? 8 : undefined}
        pattern={props.id === "codpostal" ? "[0-9]{4}-[0-9]{3}" : undefined}
      />
      {props.id === "codpostal" && (
        <p className="text-gray-500 text-xs mt-1">Formato: XXXX-XXX</p>
      )}
    </div>
  );
}

export default Inputs;
