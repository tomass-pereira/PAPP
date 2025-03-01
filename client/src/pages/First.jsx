import React, { useState } from "react";
import { 
  MapPin, Phone, Mail, Clock, MessageCircle, Calendar, 
  Check, Star, ChevronRight, Users, Award, Activity,
  Heart, ArrowRight, Menu, X, Facebook, Instagram, Linkedin
} from "lucide-react";
import NavBar from "../components/NavBar";
import SmoothScroll from "../components/SmoothScroll";
import Footer from "../components/Footer";

const First = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle FAQ item
  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  // Service areas
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

  // Testimonials data
  const testimonials = [
    {
      name: "Maria Oliveira",
      text: "Desde que comecei a fisioterapia domiciliar, minha mobilidade melhorou significativamente. O conforto de não precisar sair de casa é incrível, principalmente nos dias que sinto mais dores.",
      role: "Paciente há 8 meses",
      image: "/api/placeholder/100/100"
    },
    {
      name: "João Santos",
      text: "A atenção e cuidado durante as sessões são excepcionais. Após minha cirurgia no joelho, consegui recuperar meus movimentos muito mais rápido do que esperava graças ao atendimento personalizado.",
      role: "Paciente há 1 ano",
      image: "/api/placeholder/100/100"
    },
    {
      name: "Ana Costa",
      text: "Minha mãe idosa se beneficiou muito com a fisioterapia em casa. A fisioterapeuta é extremamente paciente e carinhosa, adaptando os exercícios conforme necessário. Recomendo fortemente!",
      role: "Filha de paciente",
      image: "/api/placeholder/100/100"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "Como funciona o atendimento domiciliar?",
      answer: "O atendimento domiciliar consiste em sessões de fisioterapia realizadas no conforto da sua casa. A fisioterapeuta leva todos os equipamentos necessários para realizar o tratamento adequado à sua condição, proporcionando maior comodidade e privacidade."
    },
    {
      question: "Qual é a duração de cada sessão?",
      answer: "As sessões de fisioterapia domiciliar têm duração média de 50 a 60 minutos, podendo variar de acordo com a necessidade de cada paciente e o tipo de tratamento realizado."
    },
    {
      question: "Os atendimentos são realizados em quais horários?",
      answer: "Oferecemos horários flexíveis, de segunda a sexta-feira, das 8h às 20h, e aos sábados das 8h às 14h. O agendamento é feito de acordo com a disponibilidade do paciente e da agenda da fisioterapeuta."
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer: "Aceitamos pagamentos em dinheiro, transferência bancária, PIX e cartões de crédito ou débito. Também oferecemos pacotes de sessões com valores diferenciados."
    }
  ];

  return (
    <div className="bg-gray-50">
      <NavBar style="fixed flex items-center justify-between bg-white py-4 px-8 border-b top-0 z-50 w-full" />

      {/* Hero Section - Enhanced with animated elements and better visuals */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-16 sm:pb-0">
        <div className="absolute right-0 top-1/3 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute left-20 top-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-5">
                Fisioterapia Domiciliar
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                <span className="block">Sua saúde no</span>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  conforto do seu lar
                </span>
              </h1>

              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                Atendimento fisioterapêutico personalizado e exclusivo, levando reabilitação e qualidade de vida até a sua casa, sem que você precise se deslocar.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/login"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Consulta
                </a>
                <SmoothScroll
                  targetId="servicos"
                  className="inline-flex items-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-1"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Conheça os Serviços
                </SmoothScroll>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-white p-3 shadow-xl rounded-2xl z-10 relative">
                <img
                  alt="Fisioterapeuta realizando atendimento domiciliar"
                  src="/api/placeholder/600/500"
                  className="rounded-xl object-cover w-full h-full"
                />
                
                {/* Floating card */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-lg shadow-lg p-4 animate-float max-w-xs">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} fill="#4F46E5" color="#4F46E5" size={18} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-semibold text-gray-800">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Mais de 200 pacientes satisfeitos!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 hidden sm:block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
            <path fill="white" fillOpacity="1" d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,112C840,107,960,117,1080,122.7C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Diferenciais - Enhanced with icons and better visual presentation */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full text-indigo-600">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">+200</div>
              <div className="text-gray-700">Pacientes Atendidos</div>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full text-indigo-600">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">5+</div>
              <div className="text-gray-700">Anos de Experiência</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 text-center transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-indigo-100 rounded-full text-indigo-600">
                <Heart className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-gray-700">Atendimento Personalizado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced with better cards and hover effects */}
      <div id="servicos" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Nossos Serviços</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tratamentos especializados realizados no conforto da sua casa, com toda a atenção e cuidado que você merece
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.title} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-3 bg-indigo-600"></div>
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {serviceIcons[index]}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-indigo-600 transition-all">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a href="#" className="inline-flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Saiba mais
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works - New section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Como Funciona</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Nosso processo é simples e centrado no seu conforto e conveniência
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold z-10">
                  1
                </div>
                <div className="absolute top-0 w-16 h-16 bg-indigo-600 rounded-full opacity-10 animate-ping"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Agendamento</h3>
              <p className="text-gray-600">
                Agende sua consulta online ou por telefone, escolhendo o dia e horário mais conveniente para você.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold z-10">
                  2
                </div>
                <div className="absolute top-0 w-16 h-16 bg-indigo-600 rounded-full opacity-10 animate-ping animation-delay-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Avaliação</h3>
              <p className="text-gray-600">
                Na primeira visita, realizamos uma avaliação completa para entender suas necessidades específicas.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold z-10">
                  3
                </div>
                <div className="absolute top-0 w-16 h-16 bg-indigo-600 rounded-full opacity-10 animate-ping animation-delay-1000"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tratamento</h3>
              <p className="text-gray-600">
                Desenvolvemos um plano de tratamento personalizado, com sessões no conforto da sua casa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - New section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">O Que Dizem Nossos Pacientes</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 relative">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="bg-indigo-600 text-white rounded-full p-2">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>
              
              <div className="mb-6 pt-4">
                <div className="flex justify-center mb-4">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full mx-1 ${
                        activeTestimonial === index ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="text-center">
                  <p className="text-gray-700 text-lg italic mb-6">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                  
                  <div className="flex items-center justify-center">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="ml-4 text-left">
                      <p className="font-semibold text-gray-800">{testimonials[activeTestimonial].name}</p>
                      <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced with better layout and visuals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="/api/placeholder/600/600"
                alt="Foto da Fisioterapeuta"
                className="rounded-2xl shadow-xl z-10 relative"
              />
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-indigo-100 rounded-2xl -z-10"></div>
              
              {/* Experience badge */}
              <div className="absolute -top-6 -left-6 bg-indigo-600 text-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium">5+ anos de experiência</p>
              </div>
            </div>
            
            <div>
              <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                Sobre Mim
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Saúde e bem-estar em seu lar
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Sou uma fisioterapeuta dedicada, com especialização em atendimento domiciliar. Acredito que cada paciente é único e merece um tratamento personalizado, por isso levo até sua casa o melhor da fisioterapia com equipamentos modernos e técnicas eficazes.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-indigo-100 rounded-full mt-1">
                    <Check className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Especialização em Fisioterapia Ortopédica</h4>
                    <p className="text-gray-600 text-sm">Tratamento de lesões musculares, articulares e pós-cirúrgicas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-indigo-100 rounded-full mt-1">
                    <Check className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Experiência em Atendimento Domiciliar</h4>
                    <p className="text-gray-600 text-sm">Adaptação dos tratamentos para o ambiente residencial</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-indigo-100 rounded-full mt-1">
                    <Check className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Formação em Técnicas de Reabilitação</h4>
                    <p className="text-gray-600 text-sm">Métodos modernos e eficazes para recuperação física</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-600">
                <p className="italic text-gray-700 mb-2">
                  "Minha missão é levar qualidade de vida até você, com tratamentos personalizados e eficazes no conforto do seu lar."
                </p>
                <p className="font-semibold text-indigo-600">Dra. Ana Silva</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Áreas de Atendimento - Enhanced with map visualization */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Áreas de Atendimento</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Atendimento domiciliar nas seguintes regiões e arredores
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Service Areas */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {areas.map((area) => (
                  <div key={area.nome} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border-t-4 border-indigo-600">
                    <h3 className="font-semibold text-gray-800 mb-4 text-lg">{area.nome}</h3>
                    <ul className="space-y-2">
                      {area.localidades.map((local, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 text-indigo-600 mr-2 flex-shrink-0" />
                          <span>{local}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Coverage Information */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">Informações de Cobertura</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Raio de atendimento</h4>
                    <p className="text-gray-600">Atendemos em um raio de até 30km das regiões listadas</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Horários flexíveis</h4>
                    <p className="text-gray-600">Segunda a sexta: 8h às 20h<br />Sábados: 8h às 14h</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Agendamento simples</h4>
                    <p className="text-gray-600">Agende online ou por telefone de acordo com sua disponibilidade</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <a 
                  href="/login" 
                  className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Agendar Minha Consulta
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - New section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Perguntas Frequentes</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tire suas dúvidas sobre o atendimento de fisioterapia domiciliar
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className={`w-full flex items-center justify-between p-5 text-left font-medium rounded-lg ${
                    activeFaq === index
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200 hover:bg-indigo-50'
                  }`}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 transform transition-transform ${
                      activeFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                
                {activeFaq === index && (
                  <div className="bg-white p-5 border-x border-b border-gray-200 rounded-b-lg">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - New section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para começar sua jornada de recuperação?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto text-lg mb-8">
            Agende agora sua avaliação e experimente os benefícios da fisioterapia no conforto do seu lar.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-1"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Minha Consulta
          </a>
        </div>
      </section>

      {/* Contact Section - New section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                Contato
              </span>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Entre em contato conosco</h2>
              <p className="text-gray-600 mb-8">
                Tem alguma dúvida sobre nossos serviços? Entre em contato e teremos o prazer em ajudar.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Telefone</h4>
                    <p className="text-gray-600">(XX) XXXXX-XXXX</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                    <p className="text-gray-600">contato@fisiohome.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Horário de Atendimento</h4>
                    <p className="text-gray-600">Segunda a sexta: 8h às 20h<br />Sábados: 8h às 14h</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex space-x-4">
                <a href="#" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-indigo-600 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Envie uma mensagem</h3>
              <form>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Como podemos ajudar?"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Enviar mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Service icons for each service
const serviceIcons = [
  <Activity className="w-6 h-6" />,  // Fisioterapia Ortopédica
  <Users className="w-6 h-6" />,      // Reabilitação Geriátrica
  <Activity className="w-6 h-6" />,   // Fisioterapia Neurológica
  <Activity className="w-6 h-6" />,   // RPG e Postural
  <Activity className="w-6 h-6" />,   // Pilates Solo
  <Activity className="w-6 h-6" />,   // Recuperação Pós-Covid
];

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