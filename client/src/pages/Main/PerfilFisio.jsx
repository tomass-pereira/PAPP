import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink
} from "lucide-react";
import SideBar from "../../components/SideBar";
import { useUser } from "../../contexts/UserContext";

const PerfilFisioterapeuta = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [expandedSection, setExpandedSection] = useState("experiencia");
  
  // Em um cenário real, esses dados viriam de uma API
  const fisioterapeuta = {
    id: 1,
    nome: "Dr. João Silva",
    titulo: "Fisioterapeuta Especialista em Ortopedia",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "joao.silva@fisioterapia.pt",
    telefone: "+351 912 345 678",
    endereco: "Av. da Liberdade, 123, Lisboa",
    website: "www.joaosilva.pt",
    sobre: "Profissional com mais de 15 anos de experiência em fisioterapia ortopédica, especializado em reabilitação pós-cirúrgica e tratamento de lesões desportivas. Trabalho com uma abordagem integrativa, combinando técnicas manuais, exercícios terapêuticos e educação do paciente para alcançar resultados eficazes e duradouros.",
    formacao: [
      {
        id: 1,
        titulo: "Doutorado em Fisioterapia",
        instituicao: "Universidade de Lisboa",
        periodo: "2010 - 2014",
        descricao: "Especialização em Reabilitação Neuro-Músculo-Esquelética"
      },
      {
        id: 2,
        titulo: "Mestrado em Ciências da Reabilitação",
        instituicao: "Universidade do Porto",
        periodo: "2007 - 2009",
        descricao: "Foco em biomecânica e análise de movimento"
      },
      {
        id: 3,
        titulo: "Licenciatura em Fisioterapia",
        instituicao: "Escola Superior de Saúde de Coimbra",
        periodo: "2003 - 2007",
        descricao: "Formação base em fisioterapia com estágios em hospitais e clínicas especializadas"
      }
    ],
    certificacoes: [
      {
        id: 1,
        titulo: "Especialista em Terapia Manual Ortopédica",
        instituicao: "International Academy of Orthopedic Medicine",
        ano: 2016
      },
      {
        id: 2,
        titulo: "Certificação em Dry Needling",
        instituicao: "European Institute of Physical Therapy",
        ano: 2015
      },
      {
        id: 3,
        titulo: "Membro da Sociedade Portuguesa de Fisioterapia",
        instituicao: "SPF",
        ano: 2008
      }
    ],
    experiencia: [
      {
        id: 1,
        cargo: "Fisioterapeuta Sênior",
        empresa: "Clínica Avançada de Fisioterapia",
        local: "Lisboa, Portugal",
        periodo: "2016 - Presente",
        descricao: "Responsável pelo tratamento de pacientes com lesões ortopédicas complexas e reabilitação pós-cirúrgica. Desenvolvimento e implementação de protocolos de tratamento personalizados. Supervisão de fisioterapeutas juniores."
      },
      {
        id: 2,
        cargo: "Fisioterapeuta",
        empresa: "Hospital Central de Lisboa",
        local: "Lisboa, Portugal",
        periodo: "2010 - 2016",
        descricao: "Atuação em enfermaria e ambulatório para tratamento de pacientes com condições neurológicas, ortopédicas e respiratórias. Participação em equipes multidisciplinares de reabilitação."
      },
      {
        id: 3,
        cargo: "Fisioterapeuta Assistente",
        empresa: "Centro de Reabilitação do Desportista",
        local: "Porto, Portugal",
        periodo: "2007 - 2010",
        descricao: "Tratamento de atletas de alto rendimento com lesões desportivas agudas e crônicas. Desenvolvimento de programas de prevenção de lesões e retorno ao esporte."
      }
    ],
    especialidades: [
      "Reabilitação Ortopédica",
      "Fisioterapia Desportiva",
      "Terapia Manual",
      "Reabilitação Pós-Cirúrgica",
      "Tratamento de Dor Crônica",
      "Dry Needling",
      "Reeducação Postural"
    ],
    publicacoes: [
      {
        id: 1,
        titulo: "Abordagem Multidisciplinar na Reabilitação de Lesões do Ligamento Cruzado Anterior",
        jornal: "Revista Portuguesa de Fisioterapia",
        ano: 2020,
        link: "#"
      },
      {
        id: 2,
        titulo: "Efeitos da Terapia Manual na Dor Lombar Crônica: Um Estudo Randomizado",
        jornal: "Journal of Physical Therapy Science",
        ano: 2018,
        link: "#"
      },
      {
        id: 3,
        titulo: "Protocolos de Reabilitação para Tendinopatias do Ombro: Revisão Sistemática",
        jornal: "European Journal of Physiotherapy",
        ano: 2016,
        link: "#"
      }
    ],
    idiomas: [
      { idioma: "Português", nivel: "Nativo" },
      { idioma: "Inglês", nivel: "Fluente" },
      { idioma: "Espanhol", nivel: "Intermediário" },
      { idioma: "Francês", nivel: "Básico" }
    ],
    horasAtendimento: [
      { dia: "Segunda-feira", horario: "09:00 - 18:00" },
      { dia: "Terça-feira", horario: "09:00 - 18:00" },
      { dia: "Quarta-feira", horario: "09:00 - 18:00" },
      { dia: "Quinta-feira", horario: "09:00 - 18:00" },
      { dia: "Sexta-feira", horario: "09:00 - 17:00" },
      { dia: "Sábado", horario: "09:00 - 13:00" },
      { dia: "Domingo", horario: "Fechado" }
    ]
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Verificar se tem token ao carregar componente
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/LoginPage");
    }
  }, [navigate]);

  const downloadCV = () => {
    // Em um cenário real, aqui redirecionaria para o download de um arquivo PDF
    alert("Download do CV iniciado");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Cabeçalho da página */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-l-4 border-teal-500">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Perfil do Fisioterapeuta
          </h1>
          <p className="text-gray-600">
            Informações detalhadas e currículo do profissional
          </p>
        </div>

        {/* Container principal - Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna lateral - Informações pessoais */}
          <div className="lg:col-span-1">
            {/* Card de informações pessoais */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-teal-100">
                  <img
                    src={fisioterapeuta.foto}
                    alt={fisioterapeuta.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800 text-center">
                  {fisioterapeuta.nome}
                </h2>
                <p className="text-teal-600 font-medium text-center mb-2">
                  {fisioterapeuta.titulo}
                </p>
                <button
                  onClick={downloadCV}
                  className="mt-3 flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Currículo
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Telefone</p>
                    <p className="text-gray-800">{fisioterapeuta.telefone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-800">{fisioterapeuta.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Endereço</p>
                    <p className="text-gray-800">{fisioterapeuta.endereco}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-teal-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Website</p>
                    <p className="text-gray-800">{fisioterapeuta.website}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de especialidades */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 text-teal-600 mr-2" />
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {fisioterapeuta.especialidades.map((especialidade, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                  >
                    {especialidade}
                  </span>
                ))}
              </div>
            </div>

            {/* Card de horários */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-teal-600 mr-2" />
                Horários de Atendimento
              </h3>
              <div className="space-y-3">
                {fisioterapeuta.horasAtendimento.map((horario, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100"
                  >
                    <p className="text-gray-700">{horario.dia}</p>
                    <p className={`font-medium ${horario.horario === "Fechado" ? "text-red-500" : "text-teal-600"}`}>
                      {horario.horario}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de idiomas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Globe className="w-5 h-5 text-teal-600 mr-2" />
                Idiomas
              </h3>
              <div className="space-y-3">
                {fisioterapeuta.idiomas.map((idioma, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <p className="text-gray-700">{idioma.idioma}</p>
                    <p className="text-sm bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                      {idioma.nivel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna principal - Currículo */}
          <div className="lg:col-span-2">
            {/* Sobre mim */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Sobre mim
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {fisioterapeuta.sobre}
              </p>
            </div>

            {/* Experiência Profissional */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('experiencia')}
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Briefcase className="w-5 h-5 text-teal-600 mr-2" />
                  Experiência Profissional
                </h3>
                {expandedSection === 'experiencia' ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'experiencia' && (
                <div className="mt-4 space-y-6">
                  {fisioterapeuta.experiencia.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-teal-200 pl-4 relative">
                      <div className="absolute w-3 h-3 bg-teal-500 rounded-full -left-[6.5px] top-1.5"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {exp.cargo}
                        </h4>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          {exp.periodo}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {exp.empresa}
                        <span className="mx-2">•</span>
                        <MapPin className="w-4 h-4 mr-1" />
                        {exp.local}
                      </div>
                      <p className="text-gray-700">{exp.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formação Acadêmica */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('formacao')}
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <GraduationCap className="w-5 h-5 text-teal-600 mr-2" />
                  Formação Acadêmica
                </h3>
                {expandedSection === 'formacao' ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'formacao' && (
                <div className="mt-4 space-y-6">
                  {fisioterapeuta.formacao.map((form) => (
                    <div key={form.id} className="border-l-2 border-teal-200 pl-4 relative">
                      <div className="absolute w-3 h-3 bg-teal-500 rounded-full -left-[6.5px] top-1.5"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {form.titulo}
                        </h4>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          {form.periodo}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        {form.instituicao}
                      </div>
                      <p className="text-gray-700">{form.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Certificações */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('certificacoes')}
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Award className="w-5 h-5 text-teal-600 mr-2" />
                  Certificações e Afiliações
                </h3>
                {expandedSection === 'certificacoes' ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'certificacoes' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fisioterapeuta.certificacoes.map((cert) => (
                    <div key={cert.id} className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                      <div className="flex items-center mb-2">
                        <Check className="w-5 h-5 text-teal-600 mr-2" />
                        <h4 className="text-gray-800 font-medium">{cert.titulo}</h4>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-600">{cert.instituicao}</p>
                        <p className="text-teal-700 font-medium">{cert.ano}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Publicações */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('publicacoes')}
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 text-teal-600 mr-2" />
                  Publicações Científicas
                </h3>
                {expandedSection === 'publicacoes' ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {expandedSection === 'publicacoes' && (
                <div className="mt-4 space-y-4">
                  {fisioterapeuta.publicacoes.map((pub) => (
                    <div key={pub.id} className="border-l-2 border-teal-200 pl-4 relative hover:bg-gray-50 p-2 rounded-r-lg transition-colors">
                      <div className="absolute w-3 h-3 bg-teal-500 rounded-full -left-[6.5px] top-3"></div>
                      <h4 className="text-gray-800 font-medium">{pub.titulo}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600">{pub.jornal}, {pub.ano}</p>
                        <a 
                          href={pub.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-teal-600 hover:text-teal-700 flex items-center text-sm font-medium"
                        >
                          Ver publicação
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerfilFisioterapeuta;