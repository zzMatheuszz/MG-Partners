import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente para o ícone de brilho (Sparkle Icon)
// Este ícone é usado para destacar as seções de geradores de IA.
// Agora usa um caractere simples '★' para leveza visual.
const SparkleIcon = () => (
  <span className="inline-block ml-1 text-[#c7a938]" aria-hidden="true">★</span>
);

// Componente principal da aplicação
const App = () => {
  // Número de telefone para o WhatsApp (substitua pelo número real do Matheus)
  const whatsappNumber = "5543996375303"; // Exemplo: 55 DDD NÚMERO
  // Mensagem padrão para o WhatsApp, codificada para URL
  const whatsappMessage = "Olá, Matheus! Gostaria de saber mais sobre seus serviços de marketing digital e como você pode me ajudar a atrair mais clientes.";
  // Link completo do WhatsApp
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Estados para o gerador de slogans
  const [productDescription, setProductDescription] = useState('');
  const [generatedSlogan, setGeneratedSlogan] = useState('');
  const [isLoadingSlogan, setIsLoadingSlogan] = useState(false);
  const [sloganError, setSloganError] = useState('');

  // Estados para o gerador de anúncios
  const [adProduct, setAdProduct] = useState('');
  const [adAudience, setAdAudience] = useState('');
  const [adBenefit, setAdBenefit] = useState('');
  const [generatedAdCopy, setGeneratedAdCopy] = useState('');
  const [isLoadingAdCopy, setIsLoadingAdCopy] = useState(false);
  const [adCopyError, setAdCopyError] = useState('');

  // Estado para simular o carregamento inicial da página
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Efeitos para o typing effect no H1
  const fullHeadingText = "Seu negócio merece crescer com estratégia.";
  const [typedHeading, setTypedHeading] = useState('');
  const [headingCharIndex, setHeadingCharIndex] = useState(0);

  // Estado para o tooltip do WhatsApp
  const [showWhatsappTooltip, setShowWhatsappTooltip] = useState(false);

  // Estado para o menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simula o carregamento da página e inicia o typing effect
  // Este useEffect é responsável por mostrar um "Carregando..." inicial
  // e depois iniciar a animação de digitação do título principal.
  useEffect(() => {
    const appLoadTimer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000); // Carrega após 2 segundos

    return () => clearTimeout(appLoadTimer);
  }, []);

  // Efeito de digitação para o H1 (cursor removido)
  // Este useEffect controla a animação de texto digitado no título principal.
  useEffect(() => {
    if (!isAppLoading && headingCharIndex < fullHeadingText.length) {
      const typingTimer = setTimeout(() => {
        setTypedHeading(prev => prev + fullHeadingText[headingCharIndex]);
        setHeadingCharIndex(prev => prev + 1);
      }, 70); // Velocidade da digitação (ms por caractere)
      return () => clearTimeout(typingTimer);
    }
  }, [headingCharIndex, fullHeadingText, isAppLoading]);

  // Função para chamar a API Gemini e gerar o slogan
  const generateSlogan = async () => {
    // Validação de entrada: verifica se a descrição do produto está vazia.
    if (!productDescription.trim()) {
      setSloganError("Por favor, descreva seu produto ou serviço para gerar um slogan.");
      setGeneratedSlogan('');
      return;
    }

    setIsLoadingSlogan(true); // Ativa o estado de carregamento
    setSloganError(''); // Limpa mensagens de erro anteriores
    setGeneratedSlogan(''); // Limpa slogans gerados anteriormente

    try {
      let chatHistory = [];
      // Prompt para a API Gemini, solicitando 3 slogans curtos e focados em vendas.
      const prompt = `Gere 3 slogans curtos e impactantes para um produto ou serviço com a seguinte descrição: "${productDescription}". Os slogans devem ser focados em vendas e atração de clientes. Separe-os por uma nova linha.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = ""; // A chave API será fornecida pelo ambiente Canvas automaticamente.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Realiza a chamada fetch para a API Gemini
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json(); // Converte a resposta para JSON

      // Verifica se a resposta da API é válida e extrai o texto gerado.
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedSlogan(text); // Define o slogan gerado
      } else {
        // Lida com respostas inesperadas da API
        setSloganError("Não foi possível gerar o slogan. Tente novamente.");
        console.error("Estrutura de resposta inesperada da API Gemini:", result);
      }
    } catch (error) {
      // Lida com erros de conexão ou outros erros na chamada da API
      setSloganError("Ocorreu um erro ao conectar com a API. Verifique sua conexão ou tente mais tarde.");
      console.error("Erro ao chamar a API Gemini:", error);
    } finally {
      setIsLoadingSlogan(false); // Desativa o estado de carregamento
    }
  };

  // Função para chamar a API Gemini e gerar o texto do anúncio
  const generateAdCopy = async () => {
    // Validação de entrada: verifica se todos os campos estão preenchidos.
    if (!adProduct.trim() || !adAudience.trim() || !adBenefit.trim()) {
      setAdCopyError("Por favor, preencha todos os campos para gerar o texto do anúncio.");
      setGeneratedAdCopy('');
      return;
    }

    setIsLoadingAdCopy(true); // Ativa o estado de carregamento
    setAdCopyError(''); // Limpa mensagens de erro anteriores
    setGeneratedAdCopy(''); // Limpa textos de anúncio gerados anteriormente

    try {
      let chatHistory = [];
      // Prompt para a API Gemini, solicitando 3 opções de textos de anúncio persuasivos.
      const prompt = `Gere 3 opções de textos curtos e persuasivos para um anúncio online.
      Produto/Serviço: "${adProduct}"
      Público-alvo: "${adAudience}"
      Principal Benefício: "${adBenefit}"
      Os textos devem ser focados em conversão e chamar a atenção do público. Separe cada opção por uma nova linha.`;
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = ""; // A chave API será fornecida pelo ambiente Canvas automaticamente.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Realiza a chamada fetch para a API Gemini
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json(); // Converte a resposta para JSON

      // Verifica se a resposta da API é válida e extrai o texto gerado.
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedAdCopy(text); // Define o texto do anúncio gerado
      } else {
        // Lida com respostas inesperadas da API
        setAdCopyError("Não foi possível gerar o texto do anúncio. Tente novamente.");
        console.error("Estrutura de resposta inesperada da API Gemini:", result);
      }
    } catch (error) {
      // Lida com erros de conexão ou outros erros na chamada da API
      setAdCopyError("Ocorreu um erro ao conectar com a API. Verifique sua conexão ou tente mais tarde.");
      console.error("Erro ao chamar a API Gemini:", error);
    } finally {
      setIsLoadingAdCopy(false); // Desativa o estado de carregamento
    }
  };

  // Renderiza o indicador de carregamento ou o conteúdo da página
  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <span className="animate-pulse text-[#D4AF37] text-xl font-semibold">Carregando...</span>
      </div>
    );
  }

  return (
    // IMPORTANT: For 'Playfair Display' and 'Inter' fonts, and Framer Motion to load
    // correctly, you MUST add the following lines in the <head> section of your main HTML file:
    // <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    // <script src="https://unpkg.com/framer-motion@latest/dist/framer-motion.umd.js"></script>
    <div className="min-h-screen bg-[#0D0D0D] font-inter leading-normal text-[#EAEAEA]">
      {/* Global CSS styles for smooth scroll and hover effects */}
      <style>
        {`
          html {
            scroll-behavior: smooth; /* Enables smooth scroll for anchors */
          }
          /* Style for animated underline on navigation links */
          .nav-link::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            background: #f1c40f; /* More vibrant gold for hover */
            left: 0;
            bottom: -6px;
            transform: scaleX(0); /* Starts invisible */
            transform-origin: left;
            transition: transform 0.3s ease; /* Smooth transition */
          }
          .nav-link:hover::after,
          .nav-link.active::after {
            transform: scaleX(1); /* Expands on hover and when active */
          }
          /* Glow effect on logo on hover */
          .logo-hover-effect:hover {
            filter: drop-shadow(0 0 5px #c7a938); /* Adds a softer golden glow */
          }
          /* Translucent shadow on navbar */
          .navbar-shadow {
            box-shadow: 0 2px 8px rgba(0,0,0,0.5); /* More pronounced shadow */
          }
        `}
      </style>

      {/* Landing Page Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }} // Starts invisible and above
        animate={{ opacity: 1, y: 0 }} // Slides to final position
        transition={{ duration: 0.8, ease: "easeOut" }} // Smooth animation
        className="bg-[#0D0D0D] py-6 px-6 md:px-12 border-b border-[#1A1A1A] navbar-shadow fixed w-full top-0 z-40" // Fixed navbar at the top with shadow
      >
        <nav className="container max-w-6xl mx-auto flex items-center justify-between">
          {/* "MG Partners" Logo - Left aligned */}
          <motion.a
            href="#"
            className="font-playfair-display leading-tight cursor-default user-select-none logo-hover-effect flex-shrink-0"
            style={{ color: '#c7a938', fontSize: '1.15rem', letterSpacing: '-0.5px', fontWeight: '700' }} // Inline styles for precision
            whileHover={{ filter: 'drop-shadow(0 0 8px #c7a938)' }} // Glow animation on hover
            transition={{ duration: 0.3 }}
          >
            <div>MG</div>
            <div className="mt-[-0.2rem] font-normal">Partners</div> {/* Controls vertical spacing, Partners com font-normal */}
          </motion.a>

          {/* Desktop Navigation */}
          {/* ml-auto pushes the menu to the right, gap-8 for spacing */}
          <ul className="hidden md:flex gap-8 items-center ml-auto">
            <li><a href="#servicos" className="text-[#e0e0e0] font-normal hover:text-[#f1c40f] transition-all duration-300 ease-in-out rounded-md p-2 relative nav-link cursor-pointer" style={{ fontSize: '0.95rem' }}>Meus Serviços</a></li>
            <li className="flex items-center text-[#e0e0e0] font-normal hover:text-[#f1c40f] transition-all duration-300 ease-in-out rounded-md p-2 relative nav-link cursor-pointer" style={{ fontSize: '0.95rem' }}>
              <a href="#gerador-slogan">Gerador de Slogans</a>
              <SparkleIcon /> {/* SVG Icon */}
            </li>
            <li className="flex items-center text-[#e0e0e0] font-normal hover:text-[#f1c40f] transition-all duration-300 ease-in-out rounded-md p-2 relative nav-link cursor-pointer" style={{ fontSize: '0.95rem' }}>
              <a href="#gerador-anuncios">Gerador de Anúncios</a>
              <SparkleIcon /> {/* SVG Icon */}
            </li>
            <li><a href="#resultados" className="text-[#e0e0e0] font-normal hover:text-[#f1c40f] transition-all duration-300 ease-in-out rounded-md p-2 relative nav-link cursor-pointer" style={{ fontSize: '0.95rem' }}>Meus Resultados</a></li>
            <li><a href="#contato" className="text-[#e0e0e0] font-normal hover:text-[#f1c40f] transition-all duration-300 ease-in-out rounded-md p-2 relative nav-link cursor-pointer" style={{ fontSize: '0.95rem' }}>Fale Comigo</a></li>
          </ul>

          {/* Botão de menu hamburguer para mobile */}
          <button
            className="md:hidden text-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md p-2 flex-shrink-0" // Adicionado flex-shrink-0
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu" // Acessibilidade
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {/* Ícone de hamburguer ou X, dependendo do estado do menu */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </nav>
        {/* Menu Mobile (animado com AnimatePresence) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} // Começa invisível e com altura zero
              animate={{ opacity: 1, height: 'auto' }} // Expande para a altura natural
              exit={{ opacity: 0, height: 0 }} // Recolhe ao sair
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden bg-[#0D0D0D] border-t border-[#1A1A1A] py-4"
            >
              <ul className="flex flex-col items-center space-y-4">
                <li><a href="#servicos" className="text-[#B0B0B0] hover:text-[#D4AF37] transition-all duration-300 ease-in-out py-2 block" onClick={() => setIsMobileMenuOpen(false)}>Meus Serviços</a></li>
                <li><a href="#gerador-slogan" className="text-[#B0B0B0] hover:text-[#D4AF37] transition-all duration-300 ease-in-out py-2 block" onClick={() => setIsMobileMenuOpen(false)}>Gerador de Slogans <span role="img" aria-label="sparkle">✨</span></a></li>
                <li><a href="#gerador-anuncios" className="text-[#B0B0B0] hover:text-[#D4AF37] transition-all duration-300 ease-in-out py-2 block" onClick={() => setIsMobileMenuOpen(false)}>Gerador de Anúncios <span role="img" aria-label="sparkle">✨</span></a></li>
                <li><a href="#resultados" className="text-[#B0B0B0] hover:text-[#D4AF37] transition-all duration-300 ease-in-out py-2 block" onClick={() => setIsMobileMenuOpen(false)}>Meus Resultados</a></li>
                <li><a href="#contato" className="text-[#B0B0B0] hover:text-[#D4AF37] transition-all duration-300 ease-in-out py-2 block" onClick={() => setIsMobileMenuOpen(false)}>Fale Comigo</a></li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      {/* Adiciona um padding-top ao body para compensar a navbar fixa */}
      <div className="pt-24"></div> {/* Altura aproximada da navbar para evitar sobreposição */}

      {/* Seção Hero - Destaque Principal */}
      <section className="relative bg-[#0D0D0D] py-32 px-6 md:px-12 text-center rounded-b-[2rem] shadow-lg">
        <div className="container max-w-6xl mx-auto">
          <h1
            className="text-5xl md:text-6xl font-extrabold text-[#EAEAEA] leading-tight tracking-tight mb-6 rounded-md p-2 font-playfair-display" // Título com Playfair Display
          >
            {typedHeading} {/* Exibe o texto digitado */}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg leading-relaxed text-[#B0B0B0] max-w-2xl mx-auto rounded-md p-2"
          >
            Estratégia, visuais profissionais e anúncios que funcionam. Tudo que você precisa para transformar presença online em faturamento.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer" // Boas práticas de segurança para links externos
            className="mt-10 inline-block text-[#0D0D0D] px-10 py-4 rounded-full font-bold uppercase tracking-wider shadow-lg focus:ring-4 focus:ring-[#D4AF37] focus:ring-opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #bfa342 0%, #d4af37 100%)' }} // Gradiente no botão
            whileHover={{ scale: 1.05, y: -5, filter: 'brightness(1.1)' }} // Adiciona animação de hover com Framer Motion
            whileTap={{ scale: 0.95 }} // Adiciona animação de clique com Framer Motion
          >
            Fale Comigo no WhatsApp!
          </motion.a>
        </div>
      </section>

      {/* Divisor após a Seção Hero */}
      <div className="container max-w-4xl mx-auto my-16 border-t border-[#1A1A1A]"></div>

      {/* Seção de Serviços */}
      <section id="servicos" className="py-24 px-6 md:px-12 bg-[#0D0D0D]"> {/* Fundo principal para manter a cor */}
        <div className="container max-w-6xl mx-auto space-y-12">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }} // Animação única ao entrar na viewport
            transition={{ duration: 0.8 }} // Duração da transição ajustada
            className="text-3xl md:text-4xl font-semibold text-center text-[#EAEAEA] mb-12 rounded-md p-2 font-playfair-display" // Título com Playfair Display
          >
            Meus Serviços Personalizados
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16"> {/* Grid responsivo para os cartões de serviço */}
            {/* Cartão de Serviço 1: Clientes certos no momento certo */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1, type: 'spring', stiffness: 300 }} // Combinando transições para efeito mais dinâmico
              className="p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)', // Fundo semitransparente
                backdropFilter: 'blur(10px)', // Efeito de desfoque de fundo
                WebkitBackdropFilter: 'blur(10px)', // Para compatibilidade com Safari
                border: '1px solid rgba(212, 175, 55, 0.3)', // Borda dourada sutil
                boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1)', // Sombra dourada sutil
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' }} // Animação de hover com glow
            >
              <div className="text-[#D4AF37] mb-4 text-center">
                {/* Ícone de Tráfego/Anúncios */}
                <svg className="w-10 h-10 text-[#D4AF37] mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#EAEAEA] mb-4 text-center">Clientes certos no momento certo</h3>
              <p className="text-[#B0B0B0] text-center text-lg leading-relaxed">
                Campanhas otimizadas que colocam seu serviço na frente de quem realmente quer comprar.
              </p>
            </motion.div>
            {/* Cartão de Serviço 2: Visual que vende mais */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 300 }} // Combinando transições
              className="p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' }} // Animação de hover com glow
            >
              <div className="text-[#D4AF37] mb-4 text-center">
                {/* Ícone de Design/Criatividade */}
                <svg className="w-10 h-10 text-[#D4AF37] mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.05 12.05L12 13l-1.95 1.95-1.95-1.95L8 12l1.95-1.95 1.95 1.95zM12 20v-2m-8-8H2m18 0h2M12 4V2m-6 6H4m16 0h2M12 16v2m-6-6H4m16 0h2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#EAEAEA] mb-4 text-center">Visual que vende mais</h3>
              <p className="text-[#B0B0B0] text-center text-lg leading-relaxed">
                Identidade visual profissional que passa confiança, valor e atrai seu público ideal.
              </p>
            </motion.div>
            {/* Cartão de Serviço 3: Foco total no crescimento do seu negócio */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 300 }} // Combinando transições
              className="p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 32px rgba(212, 175, 55, 0.1)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' }} // Animação de hover com glow
            >
              <div className="text-[#D4AF37] mb-4 text-center">
                {/* Ícone de Crescimento/Resultados */}
                <svg className="w-10 h-10 text-[#D4AF37] mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#EAEAEA] mb-4 text-center">Foco total no crescimento do seu negócio</h3>
              <p className="text-[#B0B0B0] text-center text-lg leading-relaxed">
                Você foca no que faz de melhor, enquanto eu cuido da parte digital com resultados mensuráveis.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divisor após o Gerador de Anúncios */}
      <div className="container max-w-4xl mx-auto my-16 border-t border-[#1A1A1A]"></div>

      {/* Slogan Generator Section */}
      <section id="gerador-slogan" className="py-24 px-6 md:px-12 bg-[#0D0D0D]">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-semibold text-[#EAEAEA] mb-8 rounded-md p-2 font-playfair-display"
          >
            Gerador de Slogans <SparkleIcon />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg leading-relaxed text-[#B0B0B0] mb-10 rounded-md p-2"
          >
            Crie slogans impactantes para o seu produto ou serviço em segundos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#1A1A1A] p-8 rounded-[2rem] shadow-lg max-w-2xl mx-auto"
          >
            <textarea
              className="w-full p-4 rounded-lg bg-[#0D0D0D] text-[#EAEAEA] border border-[#333333] focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 outline-none resize-y min-h-[120px] mb-6"
              placeholder="Descreva seu produto ou serviço (ex: 'Uma cafeteria aconchegante com grãos especiais e ambiente para trabalho remoto.')"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            ></textarea>
            <motion.button // Changed to motion.button
              onClick={generateSlogan}
              disabled={isLoadingSlogan}
              className="w-full inline-block text-[#0D0D0D] px-8 py-3 rounded-full font-bold uppercase tracking-wider shadow-lg focus:ring-4 focus:ring-[#D4AF37] focus:ring-opacity-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #bfa342 0%, #d4af37 100%)' }}
              whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoadingSlogan ? 'Gerando...' : 'Gerar Slogan'}
            </motion.button>

            {sloganError && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 mt-4 text-sm"
              >
                {sloganError}
              </motion.p>
            )}

            {generatedSlogan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 p-4 bg-[#0D0D0D] rounded-lg border border-[#333333] text-left"
              >
                <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">Slogans Sugeridos:</h3>
                <p className="text-[#EAEAEA] whitespace-pre-line">{generatedSlogan}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Divider after Slogan Generator */}
      <div className="container max-w-4xl mx-auto my-16 border-t border-[#1A1A1A]"></div>

      {/* Ad Copy Generator Section */}
      <section id="gerador-anuncios" className="py-24 px-6 md:px-12 bg-[#0D0D0D]">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-semibold text-[#EAEAEA] mb-8 rounded-md p-2 font-playfair-display"
          >
            Gerador de Anúncios <SparkleIcon />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg leading-relaxed text-[#B0B0B0] mb-10 rounded-md p-2"
          >
            Crie textos de anúncios persuasivos e otimizados para atrair seu público-alvo.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#1A1A1A] p-8 rounded-[2rem] shadow-lg max-w-2xl mx-auto"
          >
            <input
              type="text"
              className="w-full p-4 rounded-lg bg-[#0D0D0D] text-[#EAEAEA] border border-[#333333] focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 outline-none mb-4"
              placeholder="Produto/Serviço (ex: 'Curso de Marketing Digital para Iniciantes')"
              value={adProduct}
              onChange={(e) => setAdProduct(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-4 rounded-lg bg-[#0D0D0D] text-[#EAEAEA] border border-[#333333] focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 outline-none mb-4"
              placeholder="Público-alvo (ex: 'Pequenos empresários e autônomos')"
              value={adAudience}
              onChange={(e) => setAdAudience(e.target.value)}
            />
            <textarea
              className="w-full p-4 rounded-lg bg-[#0D0D0D] text-[#EAEAEA] border border-[#333333] focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37] focus:ring-opacity-50 outline-none resize-y min-h-[100px] mb-6"
              placeholder="Principal Benefício (ex: 'Aprenda a atrair clientes e aumentar seu faturamento com estratégias comprovadas.')"
              value={adBenefit}
              onChange={(e) => setAdBenefit(e.target.value)}
            ></textarea>
            <motion.button // Changed to motion.button
              onClick={generateAdCopy}
              disabled={isLoadingAdCopy}
              className="w-full inline-block text-[#0D0D0D] px-8 py-3 rounded-full font-bold uppercase tracking-wider shadow-lg focus:ring-4 focus:ring-[#D4AF37] focus:ring-opacity-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #bfa342 0%, #d4af37 100%)' }}
              whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoadingAdCopy ? 'Gerando...' : 'Gerar Texto de Anúncio'}
            </motion.button>

            {adCopyError && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 mt-4 text-sm"
              >
                {adCopyError}
              </motion.p>
            )}

            {generatedAdCopy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 p-4 bg-[#0D0D0D] rounded-lg border border-[#333333] text-left"
              >
                <h3 className="text-xl font-semibold text-[#D4AF37] mb-3">Textos de Anúncio Sugeridos:</h3>
                <p className="text-[#EAEAEA] whitespace-pre-line">{generatedAdCopy}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Divider after Ad Copy Generator */}
      <div className="container max-w-4xl mx-auto my-16 border-t border-[#1A1A1A]"></div>

      {/* Testimonials/Results Section */}
      <section id="resultados" className="py-24 px-6 md:px-12 bg-[#0D0D0D] text-[#EAEAEA] rounded-t-[2rem] shadow-lg"> {/* Black background and light text */}
        <div className="container max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-semibold mb-12 rounded-md p-2 font-playfair-display text-[#EAEAEA]" // White title
          >
            MG Partners: O Legado do Crescimento
          </motion.h2>
          {/* Content block with refined style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-12 rounded-xl shadow-lg border-l-4 border-[#b99b2e] mx-auto max-w-3xl text-center md:text-left" // Padding, golden border, max-width, centering and alignment
            style={{
              backgroundColor: '#f2f2f2', // Very light gray background
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' // Custom shadow
            }}
          >
            {/* Internal block title */}
            <p className="font-bold text-[#111111] mb-4 mx-auto max-w-xl md:mx-0" style={{ fontSize: '1.4rem' }}>
              Traduzimos aspirações em conquistas reais.
            </p>
            {/* Text development */}
            <p className="font-normal text-[#333333] mb-8 mx-auto max-w-xl md:mx-0" style={{ fontSize: '1.05rem', lineHeight: '1.75' }}>
              Planejamos estratégias digitais que aumentam sua visibilidade,
              <br />
              geram vendas qualificadas e consolidam um posicionamento forte no mercado.
            </p>
            {/* Frase de encerramento */}
            <p className="italic text-[#555555] text-center md:text-right border-t border-[#dddddd] pt-4 mx-auto max-w-xl md:mx-0" style={{ fontSize: '1rem', marginTop: '32px' }}>
              Mais do que números, entregamos legado.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider after Testimonials Section */}
      <div className="container max-w-4xl mx-auto my-16 border-t border-[#1A1A1A]"></div>

      {/* Final Call to Action Section */}
      <section id="contato" className="py-24 px-6 md:px-12 text-center bg-[#0D0D0D]">
        <div className="container max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-semibold text-[#EAEAEA] mb-8 rounded-md p-2 font-playfair-display"
          >
            Sua oportunidade de transformar seu negócio começa agora.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg leading-relaxed text-[#B0B0B0] mb-10 rounded-md p-2"
          >
            Descubra como criar seu legado digital com a gente.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[#0D0D0D] px-10 py-4 rounded-full font-bold uppercase tracking-wider shadow-lg focus:ring-4 focus:ring-[#D4AF37] focus:ring-opacity-50 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #bfa342 0%, #d4af37 100%)' }} // Gradiente no botão
            whileHover={{ scale: 1.05, y: -5, filter: 'brightness(1.1)' }} // Adiciona animação de hover com Framer Motion
            whileTap={{ scale: 0.95 }} // Adiciona animação de clique com Framer Motion
          >
            Converse Comigo no WhatsApp!
          </motion.a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-[#0D0D0D] text-[#B0B0B0] py-8 px-6 md:px-12 text-center rounded-t-[2rem] border-t border-[#1A1A1A]">
        <div className="container max-w-6xl mx-auto">
          <p className="text-sm">&copy; {new Date().getFullYear()} MG Partners. Todos os direitos reservados.</p>
          <div className="mt-4 text-sm space-x-4"> {/* Adicionado espaço entre os links */}
            <a href="#" className="text-[#B0B0B0] hover:text-[#D4AF37] transition-all duration-300 ease-in-out">Política de Privacidade</a>
            <span className="text-[#B0B0B0]">|</span>
            <a href="#" className="text-[#B0B0B0] hover:text-[#D4AF37] transition-all duration-300 ease-in-out">Termos de Serviço</a>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante do WhatsApp (agora encapsulado para garantir o fixed) */}
      <motion.div // Novo container para o posicionamento fixo
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0 }} // Animação de entrada para o container
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2.5, type: 'spring', stiffness: 200 }}
      >
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] p-4 rounded-full shadow-xl hover:bg-[#1DA851] transform hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer group relative flex items-center justify-center"
          aria-label="Fale conosco no WhatsApp"
          onMouseEnter={() => setShowWhatsappTooltip(true)}
          onMouseLeave={() => setShowWhatsappTooltip(false)}
          whileHover={{ scale: 1.1 }} // Animação de escala no hover
          whileTap={{ scale: 0.9 }} // Animação de clique
        >
          {/* Ícone do WhatsApp usando uma tag <img> com URL pública */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
            alt="Logo do WhatsApp"
            className="w-8 h-8"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/32x32/25D366/ffffff?text=WA"; }} // Fallback simples
          />
          <AnimatePresence>
            {showWhatsappTooltip && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap shadow-lg"
              >
                Fale comigo
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>
      </motion.div>
    </div>
  );
};

export default App;
