
import React from 'react'
import {Link} from 'react-router-dom'

export default function SideBarItem(props) {
  return (
    
   
   
    <Link className="flex items-center space-x-3 px-4 py-6 rounded-lg hover:bg-indigo-700 transition-colors" to={props.destino}>
     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={props.icone}/>
    </svg>
    {props.texto}
    </Link>

  );
}
