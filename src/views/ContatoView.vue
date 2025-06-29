<template>
  <div class="contact-page">
    <Navbar />

    <section class="banner d-flex justify-content-center align-items-center">
      <div class="text-center banner-content">
        <h1 class="display-3 fw-bold mb-3">Fale Conosco</h1>
        <p class="lead fs-4">Estamos aqui para ajudar você!</p>
        <div class="banner-icons mt-4">
          <i class="fas fa-headset mx-3"></i>
          <i class="fas fa-envelope mx-3"></i>
          <i class="fas fa-comments mx-3"></i>
        </div>
      </div>
    </section>

    <section class="container my-5 py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card contact-card shadow-lg border-0 rounded-4 overflow-hidden">
            <div class="card-header py-3" style="background: linear-gradient(90deg, #00ff9d, #53ba83)">
              <h2 class="section-title text-center mb-0">Entre em Contato</h2>
            </div>
            <div class="card-body p-4 p-md-5">
              <form action="https://formsubmit.co/nexussaude2024@gmail.com" method="POST"
                @submit.prevent="handleFormSubmit">
                <div class="mb-4">
                  <label for="name" class="form-label fw-semibold">Seu Nome</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                    <input type="text" class="form-control form-control-lg" id="name"
                      placeholder="Digite seu nome completo" name="name" required />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="email" class="form-label fw-semibold">Seu E-mail</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                    <input type="email" class="form-control form-control-lg" id="email" placeholder="seu@email.com"
                      name="email" required />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="message" class="form-label fw-semibold">Sua Mensagem</label>
                  <div class="input-group">
                    <span class="input-group-text align-items-start pt-2"><i class="fas fa-comment-dots"></i></span>
                    <textarea class="form-control form-control-lg" id="message" rows="5"
                      placeholder="Como podemos te ajudar?" name="message" required></textarea>
                  </div>
                </div>

                <input type="hidden" name="_subject" value="Nova mensagem do site Nexus Saúde!" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value="/" />

                <div class="text-center mt-4">
                  <button type="submit" class="btn btn-submit btn-lg px-5 py-3 fw-bold">
                    <i class="fas fa-paper-plane me-2"></i> Enviar Mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container-fluid py-5 contact-info-section">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4 text-center">
            <div class="p-4 rounded-3 h-100 contact-info-card">
              <i class="fas fa-phone-alt fs-1 mb-3"></i>
              <h3 class="h5 fw-bold mb-3">Telefone</h3>
              <p class="mb-0">(XX) XXXX-XXXX</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="p-4 rounded-3 h-100 contact-info-card">
              <i class="fas fa-envelope fs-1 mb-3"></i>
              <h3 class="h5 fw-bold mb-3">E-mail</h3>
              <p class="mb-0">contato@nexussaude.com</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="p-4 rounded-3 h-100 contact-info-card">
              <i class="fas fa-map-marker-alt fs-1 mb-3"></i>
              <h3 class="h5 fw-bold mb-3">Endereço</h3>
              <p class="mb-0">Av. Exemplo, 1234 - São Paulo/SP</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
  methods: {
    async handleFormSubmit(event) {
      const form = event.target;
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';

        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
        });

        if (response.ok) {
          this.$swal.fire({
            icon: 'success',
            title: 'Mensagem enviada!',
            text: 'Entraremos em contato em breve.',
            background: '#1a1a3c',
            color: '#fff',
            confirmButtonColor: '#00ff9d',
          });
          form.reset();
          this.$router.push('/');
        } else {
          throw new Error('Erro na resposta do servidor');
        }
      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: 'Erro ao enviar',
          text: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.',
          background: '#1a1a3c',
          color: '#fff',
          confirmButtonColor: '#ff3d71',
        });
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    }
  }
};
</script>

<style scoped>
.contact-page {
  background-color: #13132b;
  color: #fff;
}

.banner {
  background: linear-gradient(135deg, #1a1a3c, #13132b),
    url("/src/assets/img/fale_conosco_fundo.jpg") no-repeat center center;
  background-size: cover;
  height: 60vh;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
  position: relative;
}

.banner::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, transparent, #13132b);
}

.banner-content h1 {
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  animation: fadeInDown 0.8s ease;
}

.banner-content p {
  font-size: 1.5rem;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.banner-icons {
  animation: fadeIn 1s ease 0.4s both;
}

.banner-icons i {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  filter: drop-shadow(0px 0px 10px rgba(0, 255, 157, 0.4));
}

.banner-icons i:hover {
  color: #00ff9d;
  transform: translateY(-5px);
}

.contact-card {
  border: none;
  margin-top: -80px;
  position: relative;
  z-index: 10;
  background-color: #1a1a3c;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  filter: drop-shadow(0px 0px 15px rgba(0, 255, 157, 0.2));
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 255, 157, 0.1) !important;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  position: relative;
}

.section-title::after {
  content: "";
  width: 80px;
  height: 4px;
  background-color: #fff;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.form-control {
  border: 1px solid #2d2d5a;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 12px 15px;
  background-color: #13132b;
  color: #fff;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(0, 255, 157, 0.25);
  border-color: #00ff9d;
  background-color: #1a1a3c;
}

.form-control::placeholder {
  color: #6c757d;
}

.input-group-text {
  border-radius: 8px 0 0 8px !important;
  border-right: none;
  background-color: #2d2d5a;
  color: #00ff9d;
}

.btn-submit {
  background: linear-gradient(90deg, #00ff9d, #53ba83);
  border: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: #13132b;
  filter: drop-shadow(0px 0px 8px rgba(0, 255, 157, 0.4));
}

.btn-submit:hover {
  background: linear-gradient(90deg, #00e68d, #3e9c6e);
  transform: translateY(-3px);
  filter: drop-shadow(0px 0px 12px rgba(0, 255, 157, 0.6));
  color: #13132b;
}

.btn-submit::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.btn-submit:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

.contact-info-section {
  background: linear-gradient(135deg, #1a1a3c, #13132b);
}

.contact-info-card {
  background-color: #1a1a3c;
  border: 1px solid #2d2d5a;
  transition: all 0.3s ease;
  height: 100%;
  color: #fff;
}

.contact-info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 255, 157, 0.1);
  border-color: #00ff9d;
}

.contact-info-card i {
  color: #00ff9d;
  filter: drop-shadow(0px 0px 8px rgba(0, 255, 157, 0.4));
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }

  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 50vh;
  }

  .banner-content h1 {
    font-size: 2.5rem;
  }

  .banner-content p {
    font-size: 1.2rem;
  }

  .contact-card {
    margin-top: -50px;
  }
}
</style>