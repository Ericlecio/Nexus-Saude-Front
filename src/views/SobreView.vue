<template>
  <div class="about-page">
    <Navbar />

    <!-- Banner Hero -->
    <section class="hero-banner">
      <div class="hero-content container text-center">
        <h1 class="hero-title">Quem Somos</h1>
        <p class="hero-subtitle">Comprometidos com a saúde e o bem-estar dos nossos pacientes</p>
        <button class="btn btn-primary btn-lg mt-3" @click="scrollToSection('mission')">
          Conheça nossa missão <i class="fas fa-arrow-down ms-2"></i>
        </button>
      </div>
    </section>

    <!-- Missão -->
    <section id="mission" class="mission-section py-5" ref="mission">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card mission-card" data-aos="fade-up">
              <div class="card-body text-center">
                <h2 class="section-title">Nossa Missão</h2>
                <div class="divider"></div>
                <p class="mission-text">
                  A Nexus Saúde é uma clínica comprometida em oferecer atendimento médico de excelência, com
                  profissionais
                  altamente qualificados e tecnologia de ponta. Nosso propósito é proporcionar bem-estar, segurança e
                  resultados efetivos para nossos pacientes, através de um atendimento humanizado e personalizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- História -->
    <section class="history-section py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 order-lg-1 order-2" data-aos="fade-right">
            <h2 class="section-title">Nossa História</h2>
            <div class="divider"></div>
            <p class="history-text">
              Fundada em 2010, a Nexus Saúde surgiu com o propósito de revolucionar o atendimento médico na região.
              Começamos com uma pequena equipe e hoje somos referência em diversas especialidades médicas, atendendo
              milhares de pacientes com excelência e comprometimento.
            </p>
            <p class="history-text">
              Ao longo dos anos, investimos continuamente em tecnologia, capacitação profissional e infraestrutura,
              sempre com foco na experiência do paciente e nos melhores resultados clínicos.
            </p>
            <button class="btn btn-outline-primary mt-3" @click="openModal('history')">
              Saiba mais sobre nossa trajetória
            </button>
          </div>
          <div class="col-lg-6 order-lg-2 order-1 mb-4 mb-lg-0" data-aos="fade-left">
            <div class="placeholder-image">
              <i class="fas fa-hospital fa-10x"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="values-section py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Nossos Valores</h2>
          <div class="divider-center"></div>
          <p class="section-subtitle">Princípios que guiam nosso trabalho diário</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="100">
            <div class="card value-card h-100">
              <div class="card-body text-center">
                <div class="value-icon">
                  <i class="fas fa-star"></i>
                </div>
                <h5 class="value-title">Excelência</h5>
                <p class="value-text">
                  Buscamos a perfeição em cada detalhe do atendimento, desde o acolhimento até os resultados clínicos.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="200">
            <div class="card value-card h-100">
              <div class="card-body text-center">
                <div class="value-icon">
                  <i class="fas fa-heart"></i>
                </div>
                <h5 class="value-title">Humanização</h5>
                <p class="value-text">
                  Tratamos cada paciente com respeito, empatia e compreensão, valorizando sua individualidade.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="300">
            <div class="card value-card h-100">
              <div class="card-body text-center">
                <div class="value-icon">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <h5 class="value-title">Inovação</h5>
                <p class="value-text">
                  Adotamos tecnologias e métodos modernos para oferecer tratamentos eficazes e menos invasivos.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="100">
            <div class="card value-card h-100">
              <div class="card-body text-center">
                <div class="value-icon">
                  <i class="fas fa-hand-holding-medical"></i>
                </div>
                <h5 class="value-title">Comprometimento</h5>
                <p class="value-text">
                  Dedicamos nossa expertise e atenção para garantir a melhor experiência e resultados aos pacientes.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="200">
            <div class="card value-card h-100">
              <div class="card-body text-center">
                <div class="value-icon">
                  <i class="fas fa-users"></i>
                </div>
                <h5 class="value-title">Trabalho em Equipe</h5>
                <p class="value-text">
                  Valorizamos a colaboração multidisciplinar para oferecer um atendimento integral e personalizado.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay="300">
            <div class="card value-card h-100">
              <div class="card-body text-center">
                <div class="value-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <h5 class="value-title">Ética</h5>
                <p class="value-text">
                  Agimos com transparência, honestidade e respeito em todas as nossas relações e procedimentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Equipe -->
    <section class="team-section py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Nossa Equipe</h2>
          <div class="divider-center"></div>
          <p class="section-subtitle">Profissionais qualificados e dedicados ao seu bem-estar</p>
        </div>

        <div class="row g-4 justify-content-center">
          <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div class="card team-card h-100">
              <div class="team-icon-container">
                <i class="fas fa-user-md"></i>
              </div>
              <div class="card-body text-center">
                <h5 class="team-name">Dr. João Silva</h5>
                <p class="team-specialty">Cardiologista</p>
                <p class="team-bio">
                  Formado pela USP com especialização em Harvard. Mais de 15 anos de experiência em cardiologia clínica.
                </p>
                <div class="team-social mt-3">
                  <a href="#"><i class="fab fa-linkedin"></i></a>
                  <a href="#"><i class="fas fa-envelope ms-3"></i></a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div class="card team-card h-100">
              <div class="team-icon-container">
                <i class="fas fa-user-md"></i>
              </div>
              <div class="card-body text-center">
                <h5 class="team-name">Dra. Maria Oliveira</h5>
                <p class="team-specialty">Dermatologista</p>
                <p class="team-bio">
                  Especialista em dermatologia estética e clínica pela UNIFESP. Atua há 10 anos com tratamentos de pele.
                </p>
                <div class="team-social mt-3">
                  <a href="#"><i class="fab fa-linkedin"></i></a>
                  <a href="#"><i class="fas fa-envelope ms-3"></i></a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
            <div class="card team-card h-100">
              <div class="team-icon-container">
                <i class="fas fa-user-md"></i>
              </div>
              <div class="card-body text-center">
                <h5 class="team-name">Dr. Carlos Almeida</h5>
                <p class="team-specialty">Clínico Geral</p>
                <p class="team-bio">
                  Médico generalista com experiência em medicina de família. Formado pela UFMG com 12 anos de atuação.
                </p>
                <div class="team-social mt-3">
                  <a href="#"><i class="fab fa-linkedin"></i></a>
                  <a href="#"><i class="fas fa-envelope ms-3"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <button class="btn btn-primary" @click="openModal('team')">
            Conheça toda nossa equipe <i class="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Diferenciais -->
    <section class="features-section py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Nossos Diferenciais</h2>
          <div class="divider-center"></div>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
            <div class="feature-item text-center">
              <div class="feature-icon">
                <i class="fas fa-clock"></i>
              </div>
              <h5 class="feature-title">Atendimento Rápido</h5>
              <p class="feature-text">
                Agendamento ágil com pouco tempo de espera para consultas e exames.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
            <div class="feature-item text-center">
              <div class="feature-icon">
                <i class="fas fa-procedures"></i>
              </div>
              <h5 class="feature-title">Infraestrutura Moderna</h5>
              <p class="feature-text">
                Ambiente climatizado e equipamentos de última geração para seu conforto.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
            <div class="feature-item text-center">
              <div class="feature-icon">
                <i class="fas fa-file-medical"></i>
              </div>
              <h5 class="feature-title">Prontuário Eletrônico</h5>
              <p class="feature-text">
                Seus dados médicos seguros e acessíveis para um atendimento integrado.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="400">
            <div class="feature-item text-center">
              <div class="feature-icon">
                <i class="fas fa-comments-dollar"></i>
              </div>
              <h5 class="feature-title">Planos de Saúde</h5>
              <p class="feature-text">
                Aceitamos os principais convênios médicos e oferecemos condições especiais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section py-5">
      <div class="container text-center">
        <h2 class="cta-title">Pronto para cuidar da sua saúde?</h2>
        <p class="cta-text mb-4">
          Agende sua consulta agora mesmo e dê o primeiro passo para uma vida mais saudável.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-light btn-lg">
            <i class="fas fa-phone-alt me-2"></i> Fale Conosco
          </button>
        </div>
      </div>
    </section>

    <Footer />

    <!-- Modal -->
    <div class="modal fade" id="aboutModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="modalType === 'history'">
              <p>Conteúdo detalhado sobre a história da clínica...</p>
            </div>
            <div v-else-if="modalType === 'team'">
              <p>Lista completa de todos os profissionais da equipe...</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Modal } from 'bootstrap';
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  name: 'AboutPage',
  components: {
    Navbar,
    Footer
  },
  setup() {
    const modalType = ref('');
    const modalTitle = ref('');
    let modalInstance = null;

    const initAOS = () => {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    };

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const openModal = (type) => {
      modalType.value = type;

      if (type === 'history') {
        modalTitle.value = 'Nossa História Completa';
      } else if (type === 'team') {
        modalTitle.value = 'Nossa Equipe Completa';
      }

      const modalElement = document.getElementById('aboutModal');
      modalInstance = new Modal(modalElement);
      modalInstance.show();
    };

    return {
      modalType,
      modalTitle,
      initAOS,
      scrollToSection,
      openModal
    };
  },
  mounted() {
    this.initAOS();
  }
};
</script>

<style scoped>
.about-page {
  background-color: #f8f9fa;
  overflow-x: hidden;
}

/* Hero Banner */
.hero-banner {
  position: relative;
  background: linear-gradient(135deg, #1a1a3c, #13132b);
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  color: rgba(255, 255, 255, 0.9);
}

/* Sections Common Styles */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a3c;
  margin-bottom: 1.5rem;
  position: relative;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
}

.divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #00ff9d, #53ba83);
  margin: 1rem auto;
  border-radius: 2px;
}

.divider-center {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #00ff9d, #53ba83);
  margin: 1rem auto;
  border-radius: 2px;
}

/* Mission Section */
.mission-section {
  background-color: #fff;
}

.mission-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  background: linear-gradient(135deg, #f8f9fa, #fff);
  border-left: 5px solid #00ff9d;
}

.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 255, 157, 0.2);
}

.mission-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #495057;
}

/* History Section */
.history-section {
  background-color: #f8f9fa;
  position: relative;
}

.history-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 255, 157, 0.05), rgba(83, 186, 131, 0.05));
  z-index: 0;
}

.history-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #495057;
  margin-bottom: 1.5rem;
  position: relative;
}

.placeholder-image {
  background-color: #e9ecef;
  border-radius: 12px;
  height: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a3c;
  position: relative;
  overflow: hidden;
}

.placeholder-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(26, 26, 60, 0.1), rgba(19, 19, 43, 0.1));
}

/* Values Section */
.values-section {
  background-color: #fff;
  background-image: radial-gradient(circle at 10% 20%, rgba(0, 255, 157, 0.05) 0%, rgba(255, 255, 255, 0) 50%);
}

.value-card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  padding: 2rem 1.5rem;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-top: 3px solid transparent;
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 255, 157, 0.2);
  border-top: 3px solid #00ff9d;
}

.value-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a3c, #13132b);
  color: #00ff9d;
  border-radius: 50%;
  font-size: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.value-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a3c;
}

.value-text {
  color: #6c757d;
  line-height: 1.7;
}

/* Team Section */
.team-section {
  background-color: #f8f9fa;
  background-image: linear-gradient(135deg, rgba(26, 26, 60, 0.03) 0%, rgba(255, 255, 255, 0) 50%);
}

.team-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.team-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 255, 157, 0.2);
}

.team-icon-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a3c, #13132b);
  color: #00ff9d;
  font-size: 5rem;
}

.team-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a3c;
  margin-top: 1rem;
}

.team-specialty {
  color: #53ba83;
  font-weight: 500;
  margin-bottom: 1rem;
}

.team-bio {
  color: #6c757d;
  line-height: 1.6;
}

.team-social {
  margin-top: 1rem;
}

.team-social a {
  color: #1a1a3c;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.team-social a:hover {
  color: #00ff9d;
}

/* Features Section */
.features-section {
  background-color: #fff;
  position: relative;
}

.features-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 255, 157, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 0;
}

.feature-item {
  padding: 2rem 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;
  background-color: #fff;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(0, 255, 157, 0.2);
}

.feature-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 255, 157, 0.2);
  border-color: rgba(0, 255, 157, 0.4);
}

.feature-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a3c, #13132b);
  color: #00ff9d;
  border-radius: 50%;
  font-size: 1.8rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a3c;
}

.feature-text {
  color: #6c757d;
  line-height: 1.7;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1a1a3c, #13132b);
  color: white;
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 255, 157, 0.3) 0%, rgba(0, 255, 157, 0) 70%);
  border-radius: 50%;
}

.cta-section::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(83, 186, 131, 0.3) 0%, rgba(83, 186, 131, 0) 70%);
  border-radius: 50%;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.cta-text {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.9);
}

.btn-outline-light:hover {
  background-color: #00ff9d;
  border-color: #00ff9d;
  color: #1a1a3c;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #00ff9d, #53ba83);
  border: none;
  color: #1a1a3c;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #53ba83, #00ff9d);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 157, 0.4);
}

.btn-outline-primary {
  border-color: #1a1a3c;
  color: #1a1a3c;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #1a1a3c;
  color: white;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .hero-title {
    font-size: 2.8rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .section-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    height: 70vh;
  }

  .hero-title {
    font-size: 2.3rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .history-text,
  .mission-text {
    font-size: 1rem;
  }

  .team-icon-container {
    height: 150px;
    font-size: 4rem;
  }
}

@media (max-width: 576px) {
  .hero-banner {
    height: 60vh;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .cta-title {
    font-size: 2rem;
  }

  .cta-text {
    font-size: 1rem;
  }

  .btn-lg {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .team-icon-container {
    height: 120px;
    font-size: 3rem;
  }
}
</style>