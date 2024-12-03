


function Inputs(props) {
  const inputClass = props.id === 'codpostal' 
    ? "w-13 p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]" 
    : "w-full p-3 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f4fb9]";
    return (
      <div>
        <label htmlFor={props.id} className="block text-sm font-medium mb-2">
          {props.label}
        </label>
        <input
          type={props.type}
          id={props.id}
          placeholder={props.placeholder}
          className={inputClass}
          required
        />
        
      </div>
    );
  }
  export default Inputs;