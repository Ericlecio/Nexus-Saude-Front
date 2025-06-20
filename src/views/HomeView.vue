<template>
  <div>
    <div v-if="loading" class="loading-screen">
      <img src="/src/assets/img/NexusSaude_horizontal.png" alt="Logo" class="loading-logo" />
    </div>

    <div v-show="!loading">
      <Navbar :user="user" />

      <section class="banner" :style="{ backgroundImage: `url(${imagensBanner[imagemAtual]})` }">
        <div class="text-center">
          <h1>Cuide da sua Saúde com Profissionais de Confiança</h1>
          <p>Consultas rápidas e seguras ao alcance de um clique</p>
          <router-link v-if="user?.papel === 'PACIENTE'" to="/Agendamento" class="btn btn-success btn-lg">
            MARQUE SUA CONSULTA
          </router-link>
        </div>
      </section>
      <br>

      <section class="cta">
        <div class="container text-center">
          <h2>Quer saber mais?</h2>
          <p>Nosso time de profissionais está pronto para ajudá-lo!</p>
          <router-link to="/contato" class="btn btn-primary btn-lg">Fale Conosco</router-link>
        </div>
      </section>

      <section class="container my-5">
        <h2 class="section-title text-center" data-aos="fade-up">Nossos Serviços</h2><br>

        <div class="row text-center">
          <!-- Primeira linha -->
          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            <div class="card service-card shadow-lg">
              <i class="fa fa-user-md fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Clínica Geral</h5>
                <p class="card-text">Atendimento completo para diversas especialidades.</p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
            <div class="card service-card shadow-lg">
              <i class="fa fa-thermometer fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Dermatologia</h5>
                <p class="card-text">Tratamentos para uma pele saudável e bonita.</p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
            <div class="card service-card shadow-lg">
              <i class="fa fa-heartbeat fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Cardiologia</h5>
                <p class="card-text">Cuide da saúde do seu coração com nossos especialistas.</p>
              </div>
            </div>
          </div>

          <!-- Segunda linha -->
          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="800">
            <div class="card service-card shadow-lg">
              <i class="fa fa-teeth fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Odontologia</h5>
                <p class="card-text">Cuidado completo para sua saúde bucal e estética.</p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1000">
            <div class="card service-card shadow-lg">
              <i class="fa fa-eye fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Oftalmologia</h5>
                <p class="card-text">Exames e tratamentos para a saúde dos seus olhos.</p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1200">
            <div class="card service-card shadow-lg">
              <i class="fa fa-brain fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Neurologia</h5>
                <p class="card-text">Diagnóstico e acompanhamento de doenças neurológicas.</p>
              </div>
            </div>
          </div>

          <!-- Terceira linha -->
          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1400">
            <div class="card service-card shadow-lg">
              <i class="fa fa-bone fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Ortopedia</h5>
                <p class="card-text">Tratamento de lesões ósseas e musculares.</p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1600">
            <div class="card service-card shadow-lg">
              <i class="fa fa-user-nurse fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Enfermagem</h5>
                <p class="card-text">Cuidados médicos e suporte hospitalar qualificado.</p>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1800">
            <div class="card service-card shadow-lg">
              <i class="fa fa-user-psychologist fa-3x icon-animate"></i>
              <div class="card-body">
                <h5 class="card-title">Psicologia</h5>
                <p class="card-text">Apoio emocional e acompanhamento psicológico.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="faq py-5">
        <div class="container">
          <h2 class="section-title text-center">Perguntas Frequentes</h2>
          <div class="accordion" id="faqAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                  aria-expanded="true" aria-controls="collapseOne">
                  Como faço para agendar uma consulta?
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
                <div class="accordion-body">
                  Para agendar uma consulta, basta clicar no botão "Marque sua Consulta" e escolher o melhor horário.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Quais convênios são aceitos?
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo">
                <div class="accordion-body">
                  Aceitamos diversos convênios. Entre em contato para verificar o seu.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  Quais são os horários de atendimento?
                </button>
              </h2>
              <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree">
                <div class="accordion-body">
                  Nosso atendimento ocorre de segunda a sexta, das 8h às 18h, e aos sábados das 8h às 12h.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFour">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  Como posso cancelar ou remarcar uma consulta?
                </button>
              </h2>
              <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour">
                <div class="accordion-body">
                  Para cancelar ou remarcar sua consulta, acesse sua conta em nosso site ou entre em contato pelo
                  telefone.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFive">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                  Quais especialidades estão disponíveis?
                </button>
              </h2>
              <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive">
                <div class="accordion-body">
                  Temos diversas especialidades, incluindo cardiologia, dermatologia, pediatria, ortopedia e mais.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingSix">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                  Existe estacionamento no local?
                </button>
              </h2>
              <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix">
                <div class="accordion-body">
                  Sim, oferecemos estacionamento gratuito para nossos pacientes.
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingSeven">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                  Atendem emergências?
                </button>
              </h2>
              <div id="collapseSeven" class="accordion-collapse collapse" aria-labelledby="headingSeven">
                <div class="accordion-body">
                  Sim, oferecemos atendimento emergencial para casos de urgência médica.
                </div>
              </div>
            </div>
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
      user: null,
      imagemAtual: 0,
      imagensBanner: [
        "/img/Fundo1.png",
        "/img/Fundo2.jpg",
        "/img/Fundo3.jpg",
      ],
    };
  },
  async mounted() {
    setTimeout(() => {
      this.loading = false;
      AOS.init();
    }, 1000);

    await this.buscarUsuarioLogado();

    setInterval(() => {
      this.imagemAtual = (this.imagemAtual + 1) % this.imagensBanner.length;
    }, 5000);
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
    }
  }
};
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

.banner {
  background-size: cover;
  background-position: center;
  height: 100vh;
  color: #0C0636;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-image 1s ease-in-out;
}


.section-title {
  margin-top: 30px;
  font-size: 2rem;
  color: #333;
}

.service-card {
  border: none;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 20px;
  border-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-card .card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-card .card-title {
  font-size: 1.3rem;
  font-weight: bold;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.service-card .card-text {
  flex-grow: 1;
  font-size: 1rem;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.icon-animate {
  animation: bounceIn 1s ease-out;
}

.testimonial,
.faq,
.footer {
  padding: 40px 0;
}

.carousel-inner .carousel-item {
  text-align: center;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #0C0636;
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity 1s ease-out;
  backdrop-filter: blur(5px);
}

.loading-logo {
  width: 800px;
  animation: fadeInOut 3s ease-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>