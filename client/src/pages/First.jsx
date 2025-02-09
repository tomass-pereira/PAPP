import React from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Calendar } from "lucide-react";
import NavBar from "../components/NavBar";
import SmoothScroll from "../components/SmoothScroll";

const First = () => {
  const areas = [
  {
    nome: "Santa Maria da Feira",
    localidades: [
      "Santa Maria da Feira",
      "São João de Ver",
      "Lourosa",
      "Fiães",
      "Mozelos",
      "Paços de Brandão"
    ]
  },
  {
    nome: "Vila Nova de Gaia e Arredores",
    localidades: [
      "Vila Nova de Gaia",
      "Mafamude",
      "Santa Marinha",
      "Canidelo",
      "Vilar de Andorinho",
      "Oliveira do Douro"
    ]
  }
];
  return (
    <>
      <NavBar style="fixed flex items-center justify-between bg-white py-4 px-8 border-b top-0 z-50 w-full" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Fisioterapia no Conforto do seu lar
            </h1>

            <p className="text-gray-600 mt-4 md:block text-lg">
              Atendimento personalizado e exclusivo, levando cuidado e reabilitação até a sua casa. Tratamentos adaptados às suas necessidades, sem que você precise sair de casa.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <a
                href="/login"
                className="inline-block rounded-lg bg-indigo-600 px-8 py-4 text-sm font-medium text-white transition hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Agendar Consulta
                </div>
              </a>
              <SmoothScroll
    targetId="servicos"
    className="inline-block rounded-lg border-2 border-indigo-600 px-8 py-4 text-sm font-medium text-indigo-600 transition hover:bg-blue-50 hover:shadow-lg transform hover:-translate-y-1"
  >
    Conheça os Serviços
  </SmoothScroll>
            </div>
          </div>
        </div>

        <img
          alt="Fisioterapeuta realizando atendimento domiciliar"
          src="/api/placeholder/800/600"
          className="h-56 w-full object-cover sm:h-full transform hover:scale-105 transition-transform duration-500"
        />
      </section>

      {/* Diferenciais */}
      <section className="bg-white py-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">+200</div>
              <div className="text-gray-600">Pacientes Atendidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600">Atendimento Personalizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div id="servicos" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-4">Serviços</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Tratamentos especializados realizados no conforto da sua casa, com toda a atenção e cuidado que você merece
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.title} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <h3 className="text-xl font-semibold mb-3 text-indigo-600">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sobre Mim</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Sou uma fisioterapeuta dedicada, com experiência em atendimento domiciliar. Acredito que cada paciente é único e merece um tratamento personalizado, por isso levo até sua casa o melhor da fisioterapia.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Especialização em Fisioterapia Ortopédica</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Experiência em Atendimento Domiciliar</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Formação em Técnicas de Reabilitação</span>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <img
                src="/api/placeholder/600/400"
                alt="Foto da Fisioterapeuta"
                className="rounded-lg shadow-lg"
              />

              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="italic text-gray-600 mb-4">
                  "Minha missão é levar qualidade de vida até você, com tratamentos personalizados e eficazes no conforto do seu lar."
                </p>
                <p className="font-semibold text-blue-600">Nome da Fisioterapeuta</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* Áreas de Atendimento */}
      <section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-4">Áreas de Atendimento</h2>
    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
      Atendimento domiciliar em Lisboa e região metropolitana
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      {/* Texto e Cards */}
      <div className="grid grid-cols-2 gap-4">
        {areas.map((area) => (
          <div key={area.nome} className="bg-gray-50 p-6 rounded-lg text-center hover:bg-indigo-50 hover:shadow-md transition-all">
            <h3 className="font-semibold text-indigo-600 mb-2">{area.nome}</h3>
            <p className="text-sm text-gray-600">{area.codigoPostal}</p>
          </div>
        ))}
      </div>
      
      {/* Informações adicionais */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Informações de Cobertura</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <span>Raio de atendimento de até 30km</span>
          </li>
          <li className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Horários flexíveis</span>
          </li>
          <li className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Agendamento online</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

{/* Footer Atualizado */}
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
  );
};

const services = [
  {
    title: "Fisioterapia Ortopédica",
    description: "Reabilitação de lesões musculares, articulares e pós-cirúrgicas no conforto da sua casa."
  },
  {
    title: "Reabilitação Geriátrica",
    description: "Atendimento especializado para idosos, focando na mobilidade e independência."
  },
  {
    title: "Fisioterapia Neurológica",
    description: "Tratamento personalizado para pacientes com condições neurológicas em ambiente domiciliar."
  },
  {
    title: "RPG e Postural",
    description: "Correção postural e tratamento das dores crônicas com técnicas especializadas."
  },
  {
    title: "Pilates Solo",
    description: "Exercícios adaptados para realizar em casa, fortalecendo músculos e melhorando a postura."
  },
  {
    title: "Recuperação Pós-Covid",
    description: "Programa específico para recuperação respiratória e física após Covid-19."
  }
];

export default First;