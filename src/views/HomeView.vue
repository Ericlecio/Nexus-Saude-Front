<template>
  <div class="home-page">
    <!-- Tela de carregamento aprimorada -->
    <transition name="fade">
      <div v-if="loading" class="loading-screen">
        <div class="loading-content">
          <img src="/src/assets/img/NexusSaude_horizontal.png" alt="Nexus Saúde" class="loading-logo" />
          <div class="loading-progress">
            <div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </transition>

    <div v-show="!loading">
      <Navbar :user="user" />

      <!-- Banner hero com slider automático -->
      <section class="hero-banner">
        <div class="slider-container">
          <div class="slide" :style="{ backgroundImage: `url(${imagensBanner[imagemAtual]})` }"></div>

          <div class="hero-content">
            <h1 data-aos="fade-up" data-aos-delay="200">Cuide da sua Saúde com Profissionais de Confiança</h1>
            <p data-aos="fade-up" data-aos-delay="400">Consultas rápidas e seguras ao alcance de um clique</p>
            <div class="cta-buttons" data-aos="fade-up" data-aos-delay="600">
              <router-link v-if="user?.papel === 'PACIENTE'" to="/Agendamento" class="btn btn-primary btn-lg">
                <i class="bi bi-calendar-plus me-2"></i> MARQUE SUA CONSULTA
              </router-link>
              <router-link v-else to="/login" class="btn btn-outline-light btn-lg">
                <i class="bi bi-box-arrow-in-right me-2"></i> ACESSAR MINHA CONTA
              </router-link>
            </div>
          </div>

          <div class="slider-controls">
            <button v-for="(image, index) in imagensBanner" :key="'control-' + index"
              :class="{ active: imagemAtual === index }" @click="imagemAtual = index"
              :aria-label="`Ir para slide ${index + 1}`"></button>
          </div>
        </div>
      </section>

      <!-- CTA intermediário -->
      <section class="intermediate-cta" data-aos="fade-up">
        <div class="container text-center">
          <h2>Quer saber mais?</h2>
          <p>Nosso time de profissionais está pronto para ajudá-lo!</p>
          <router-link to="/contato" class="btn btn-light btn-lg">
            <i class="bi bi-chat-left-text me-2"></i> Fale Conosco
          </router-link>
        </div>
      </section>

      <!-- Seção de destaques -->
      <section class="highlights">
        <div class="container">
          <div class="row">
            <div class="col-md-4 highlight-item" data-aos="fade-up">
              <div class="highlight-card">
                <i class="bi bi-clock"></i>
                <h3>Atendimento Rápido</h3>
                <p>Agendamento online com confirmação imediata</p>
              </div>
            </div>
            <div class="col-md-4 highlight-item" data-aos="fade-up" data-aos-delay="150">
              <div class="highlight-card">
                <i class="bi bi-shield-check"></i>
                <h3>Segurança</h3>
                <p>Prontuário eletrônico protegido e confidencial</p>
              </div>
            </div>
            <div class="col-md-4 highlight-item" data-aos="fade-up" data-aos-delay="300">
              <div class="highlight-card">
                <i class="bi bi-people"></i>
                <h3>+50 Profissionais</h3>
                <p>Equipe qualificada e especializada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de serviços -->
      <section class="services-section">
        <div class="container">
          <div class="section-header" data-aos="fade-up">
            <h2 class="section-title">Nossos Serviços</h2>
            <p class="section-subtitle">Conheça nossas especialidades médicas</p>
          </div>

          <div class="row">
            <div v-for="(service, index) in services" :key="service.id" class="col-md-4 mb-4" data-aos="fade-up"
              :data-aos-delay="100 + (index * 100)">
              <div class="service-card">
                <div class="service-icon">
                  <i :class="service.icon"></i>
                </div>
                <div class="service-body">
                  <h3>{{ service.title }}</h3>
                  <p>{{ service.description }}</p>
                  <router-link v-if="user?.papel === 'PACIENTE'" to="/Agendamento" class="service-link">
                    Agendar consulta <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de FAQ -->
      <section class="faq-section">
        <div class="container">
          <div class="row">
            <div class="col-lg-6" data-aos="fade-right">
              <div class="section-header">
                <h2 class="section-title">Perguntas Frequentes</h2>
                <p class="section-subtitle">Encontre respostas para suas dúvidas</p>
              </div>

              <div class="faq-image">
                <img src="/src/assets/img/faq-image.jpg" alt="Atendimento médico" class="img-fluid">
              </div>
            </div>

            <div class="col-lg-6" data-aos="fade-left">
              <div class="accordion" id="faqAccordion">
                <div v-for="(faq, index) in faqs" :key="faq.id" class="accordion-item">
                  <h3 class="accordion-header" :id="'heading' + index">
                    <button class="accordion-button" :class="{ collapsed: activeFaq !== index }" type="button"
                      @click="toggleFaq(index)" :aria-expanded="activeFaq === index ? 'true' : 'false'"
                      :aria-controls="'collapse' + index">
                      {{ faq.question }}
                    </button>
                  </h3>
                  <div :id="'collapse' + index" class="accordion-collapse collapse"
                    :class="{ show: activeFaq === index }" :aria-labelledby="'heading' + index">
                    <div class="accordion-body">
                      {{ faq.answer }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA final -->
      <section class="final-cta" data-aos="fade-up">
        <div class="container text-center">
          <h2>Pronto para cuidar da sua saúde?</h2>
          <p>Agende sua consulta agora mesmo ou entre em contato para mais informações</p>
          <div class="cta-buttons">
            <router-link to="/contato" class="btn btn-outline-light btn-lg">
              <i class="bi bi-chat-left-text me-2"></i> FALE CONOSCO
            </router-link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

export default {
  components: { Navbar, Footer },
  data() {
    return {
      loading: true,
      loadingProgress: 0,
      user: null,
      imagemAtual: 0,
      activeFaq: 0,
      imagensBanner: [
        "/img/Fundo1.png",
        "/img/Fundo2.jpg",
        "/img/Fundo3.jpg",
      ],
      services: [
        { id: 1, title: "Clínica Geral", icon: "bi bi-heart-pulse", description: "Atendimento completo para diversas especialidades." },
        { id: 2, title: "Dermatologia", icon: "bi bi-prescription2", description: "Tratamentos para uma pele saudável e bonita." },
        { id: 3, title: "Cardiologia", icon: "bi bi-heart", description: "Cuide da saúde do seu coração com nossos especialistas." },
        { id: 4, title: "Odontologia", icon: "bi bi-tooth", description: "Cuidado completo para sua saúde bucal e estética." },
        { id: 5, title: "Oftalmologia", icon: "bi bi-eye", description: "Exames e tratamentos para a saúde dos seus olhos." },
        { id: 6, title: "Neurologia", icon: "bi bi-activity", description: "Diagnóstico e acompanhamento de doenças neurológicas." },
        { id: 7, title: "Ortopedia", icon: "bi bi-bone", description: "Tratamento de lesões ósseas e musculares." },
        { id: 8, title: "Enfermagem", icon: "bi bi-clipboard2-pulse", description: "Cuidados médicos e suporte hospitalar qualificado." },
        { id: 9, title: "Psicologia", icon: "bi bi-emoji-smile", description: "Apoio emocional e acompanhamento psicológico." }
      ],
      faqs: [
        { id: 1, question: "Como faço para agendar uma consulta?", answer: "Para agendar uma consulta, basta clicar no botão 'Marque sua Consulta' e escolher o melhor horário." },
        { id: 2, question: "Quais convênios são aceitos?", answer: "Aceitamos diversos convênios. Entre em contato para verificar o seu." },
        { id: 3, question: "Quais são os horários de atendimento?", answer: "Nosso atendimento ocorre de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h." },
        { id: 4, question: "Como posso cancelar ou remarcar uma consulta?", answer: "Para cancelar ou remarcar sua consulta, acesse sua conta em nosso site ou entre em contato pelo telefone." },
        { id: 5, question: "Quais especialidades estão disponíveis?", answer: "Temos diversas especialidades, incluindo cardiologia, dermatologia, pediatria, ortopedia e mais." },
        { id: 6, question: "Existe estacionamento no local?", answer: "Sim, oferecemos estacionamento gratuito para nossos pacientes." },
        { id: 7, question: "Atendem emergências?", answer: "Sim, oferecemos atendimento emergencial para casos de urgência médica." }
      ]
    };
  },
  async mounted() {
    // Simula progresso de carregamento
    const interval = setInterval(() => {
      this.loadingProgress += 10;
      if (this.loadingProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    }, 200);

    await this.buscarUsuarioLogado();
    AOS.init({ duration: 800, once: true });

    // Configura o slider automático
    this.sliderInterval = setInterval(() => {
      this.imagemAtual = (this.imagemAtual + 1) % this.imagensBanner.length;
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.sliderInterval);
  },
  methods: {
    async buscarUsuarioLogado() {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:8080/usuarios/logado", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error("Erro ao buscar usuário logado:", error);
        sessionStorage.removeItem("authToken");
        this.user = null;
      }
    },
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index;
    }
  }
};
</script>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* Tela de carregamento */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.loading-content {
  text-align: center;
}

.loading-logo {
  max-width: 400px;
  margin-bottom: 30px;
  animation: pulse 2s infinite;
}

.loading-progress {
  width: 300px;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #00ff9d, #53ba83);
  transition: width 0.3s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Banner hero */
.hero-banner {
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease-in-out;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #0C0636;
  width: 90%;
  max-width: 800px;
  z-index: 2;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.hero-content h1 {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #03052b;
}

.hero-content p {
  font-size: 1.4rem;
  margin-bottom: 30px;
  color: #1a1a3c;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #00ff9d, #53ba83);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-outline-light {
  border: 2px solid white;
  color: white;
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: rgba(255, 255, 255, 0.1);
}

.slider-controls {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 3;
}

.slider-controls button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.slider-controls button.active {
  background-color: #00ff9d;
  transform: scale(1.2);
}

/* Seções comuns */
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #03052b;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #00ff9d, #53ba83);
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
}

/* Seção de destaques */
.highlights {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.highlight-card {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.highlight-card i {
  font-size: 2.5rem;
  color: #00ff9d;
  margin-bottom: 20px;
}

.highlight-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #03052b;
}

.highlight-card p {
  color: #666;
}

/* Seção de serviços */
.services-section {
  padding: 80px 0;
}

.service-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.service-icon {
  background: linear-gradient(135deg, #00ff9d, #53ba83);
  color: white;
  padding: 30px;
  text-align: center;
}

.service-icon i {
  font-size: 2.5rem;
}

.service-body {
  padding: 25px;
}

.service-body h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #03052b;
}

.service-body p {
  color: #666;
  margin-bottom: 20px;
}

.service-link {
  color: #00ff9d;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s ease;
}

.service-link:hover {
  color: #03052b;
}

.service-link i {
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.service-link:hover i {
  transform: translateX(5px);
}

/* CTA intermediário */
.intermediate-cta {
  padding: 60px 0;
  background: linear-gradient(135deg, #03052b, #1a1a3c);
  color: white;
  text-align: center;
}

.intermediate-cta h2 {
  font-size: 2.2rem;
  margin-bottom: 15px;
}

.intermediate-cta p {
  font-size: 1.2rem;
  margin-bottom: 25px;
  opacity: 0.9;
}

/* Seção FAQ */
.faq-section {
  padding: 80px 0;
}

.faq-image {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.faq-image img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
}

.accordion-item {
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.accordion-button {
  font-weight: 600;
  padding: 20px;
  background-color: white;
  color: #03052b;
}

.accordion-button:not(.collapsed) {
  background-color: #00ff9d;
  color: white;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: transparent;
}

.accordion-body {
  padding: 20px;
  background-color: #f8f9fa;
}

/* CTA final */
.final-cta {
  padding: 80px 0;
  background: linear-gradient(135deg, #03052b, #1a1a3c);
  color: white;
  text-align: center;
}

.final-cta h2 {
  font-size: 2.2rem;
  margin-bottom: 20px;
}

.final-cta p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.final-cta .btn-light {
  background-color: white;
  color: #03052b;
  transition: all 0.3s ease;
}

.final-cta .btn-light:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Responsividade */
@media (max-width: 992px) {
  .hero-content h1 {
    font-size: 2.2rem;
  }

  .hero-content p {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    min-height: 500px;
  }

  .hero-content h1 {
    font-size: 1.8rem;
  }

  .hero-content {
    padding: 20px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .faq-section .row {
    flex-direction: column-reverse;
  }

  .faq-image {
    margin-top: 40px;
  }
}

@media (max-width: 576px) {
  .hero-content {
    width: 95%;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .highlight-card {
    padding: 20px;
  }

  .loading-logo {
    max-width: 300px;
  }
}
</style>