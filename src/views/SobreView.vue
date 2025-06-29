<template>
  <div class="div-principal">
    <Navbar />

    <!-- Banner -->
    <section class="banner" style="background-image: url('/src/assets/img/quem_somos_fundo.jpg')">
      <div class="text-center banner-content">
        <h1>Quem Somos</h1>
        <p>Comprometidos com a saúde e o bem-estar dos nossos pacientes</p>
      </div>
    </section>

    <!-- Missão -->
    <section class="mission-section py-5">
      <div class="container text-center">
        <div class="card mission-card mx-auto" data-aos="fade-up">
          <h2 class="section-title">Nossa Missão</h2>
          <p>
            A Nexus Saúde é uma clínica comprometida em oferecer atendimento médico de qualidade, com profissionais
            experientes e dedicados, buscando sempre proporcionar bem-estar e segurança aos nossos pacientes.
          </p>
        </div>
      </div>
    </section>

    <!-- História -->
    <section class="history-section py-5 bg-light">
      <div class="container">
        <h2 class="section-title text-center">Nossa História</h2>
        <div class="row align-items-center">
          <div class="col-md-6" data-aos="fade-right">
            <p>
              Fundada em 2010, a Nexus Saúde se destacou pelo compromisso com a excelência no atendimento médico. Ao
              longo dos anos, nossa clínica se consolidou como referência em diversas especialidades médicas.
            </p>
          </div>
          <div class="col-md-6 text-center" data-aos="fade-left">
            <img src="/src/assets/img/clinico_geral.webp" class="img-fluid rounded shadow-lg" alt="Nossa História" />
          </div>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="values-section py-5">
      <div class="container text-center">
        <h2 class="section-title">Nossos Valores</h2>
        <div class="row">
          <div class="col-md-4" data-aos="zoom-in" data-aos-delay="200">
            <div class="card value-card shadow">
              <i class="fa fa-star fa-3x mb-3 icon"></i>
              <h5>Excelência no Atendimento</h5>
              <p>Garantimos qualidade em cada interação com nossos pacientes.</p>
            </div>
          </div>
          <div class="col-md-4" data-aos="zoom-in" data-aos-delay="400">
            <div class="card value-card shadow">
              <i class="fa fa-hand-holding-heart fa-3x mb-3 icon"></i>
              <h5>Empatia e Humanização</h5>
              <p>Trabalhamos para criar conexões verdadeiras e cuidar com humanidade.</p>
            </div>
          </div>
          <div class="col-md-4" data-aos="zoom-in" data-aos-delay="600">
            <div class="card value-card shadow">
              <i class="fa fa-laptop-medical fa-3x mb-3 icon"></i>
              <h5>Inovação em Tecnologia</h5>
              <p>Utilizamos ferramentas modernas para um atendimento eficaz.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Equipe -->
    <section class="team-section py-5 bg-light">
      <div class="container text-center">
        <h2 class="section-title">Nossa Equipe</h2>
        <div class="row">
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <img src="/src/assets/img/cardiologia.webp" class="img-fluid rounded-circle mb-3" alt="Dr. João" />
            <h5>Dr. João Silva</h5>
            <p>Especialista em Cardiologia</p>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="400">
            <img src="/src/assets/img/dermatologia.webp" class="img-fluid rounded-circle mb-3" alt="Dra. Maria" />
            <h5>Dra. Maria Oliveira</h5>
            <p>Especialista em Dermatologia</p>
          </div>
          <div class="col-md-4" data-aos="fade-up" data-aos-delay="600">
            <img src="/src/assets/img/clinico_geral.webp" class="img-fluid rounded-circle mb-3" alt="Dr. Carlos" />
            <h5>Dr. Carlos Almeida</h5>
            <p>Clínico Geral</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import AOS from "aos";
import "aos/dist/aos.css";

export default {
  components: {
    Navbar,
    Footer,
  },
  mounted() {
    AOS.init();
  },
};
</script>


<style scoped>
.div-principal {
  background: linear-gradient(rgba(0, 0, 30, 0.6), rgba(0, 0, 30, 0.6)),
    url("@/assets/img/img_fundo.png") no-repeat center center fixed;
  background-size: cover;
}

.banner {
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
}

.banner-content h1 {
  font-size: 3rem;
  font-weight: bold;
}

.banner-content p {
  font-size: 1.5rem;
  margin-top: 10px;
}

.mission-card {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.values-section .value-card {
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.3s ease-in-out;
}

.values-section .value-card:hover {
  transform: translateY(-10px);
  background-color: rgba(83, 186, 131, 0.1);
}

.values-section .icon {
  color: #53ba83;
}

.team-section img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.team-section h5 {
  font-size: 1.2rem;
  margin-top: 10px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .banner {
    height: 40vh;
  }

  .banner-content h1 {
    font-size: 2rem;
  }

  .banner-content p {
    font-size: 1rem;
  }

  .values-section .col-12 {
    margin-bottom: 20px;
  }
}
</style>