import React from 'react'
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Calendar } from "lucide-react";
export default function Footer() {
  return (
    <>
   <footer className="bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sobre */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sobre o Atendimento</h3>
        <p className="text-gray-400">
          Fisioterapia domiciliar personalizada, focada na sua recuperação e bem-estar. Atendimento em Lisboa e região.
        </p>
      </div>

      {/* Contatos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contatos</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-gray-400">
            <Mail className="w-5 h-5" />
            <span>contato@exemplo.com</span>
          </li>
          <li className="flex items-center gap-3 text-gray-400">
            <Phone className="w-5 h-5" />
            <span>+351 123 456 789</span>
          </li>
        </ul>
      </div>

      {/* Horário */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Horário</h3>
        <ul className="space-y-2 text-gray-400">
          <li>Segunda - Sexta: 8h-20h</li>
          <li>Sábado: 9h-14h</li>
          <li>Domingo: Fechado</li>
        </ul>
      </div>

      {/* Redes Sociais */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Redes Sociais</h3>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-full">
            <Mail className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-full">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-full">
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
      <p>&copy; {new Date().getFullYear()} Fisioterapia Domiciliar. Todos os direitos reservados.</p>
    </div>
  </div>
</footer>
    </>
  )
}
