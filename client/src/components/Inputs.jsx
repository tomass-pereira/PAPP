function Inputs(props) {
  const handlePostalCode = (e) => {
    if (props.id === 'codpostal') {
      // Remove caracteres não numéricos
      let value = e.target.value.replace(/\D/g, '');
      
      // Adiciona o hífen depois de 4 dígitos
      if (value.length > 4) {
        value = value.slice(0, 4) + '-' + value.slice(4, 7);
      }
      
      // Atualiza o valor do input
      e.target.value = value.slice(0, 8);
    }
  };

  
    
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
        
        
        disabled={false}
        onChange={props.onChange}
        maxLength={props.id === 'codpostal' ? 8 : undefined}
        pattern={props.id === 'codpostal' ? '[0-9]{4}-[0-9]{3}' : undefined}
      />
      {props.id === 'codpostal' && (
        <p className="text-gray-500 text-xs mt-1">
          Formato: XXXX-XXX
        </p>
      )}
    </div>
  );
}

export default Inputs;