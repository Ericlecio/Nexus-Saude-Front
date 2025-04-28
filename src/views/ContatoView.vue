<template>
  <div>
    <Navbar />

    <section class="banner d-flex justify-content-center align-items-center">
      <div class="text-center banner-content">
        <h1 class="display-4">Fale Conosco</h1>
        <p class="lead">Estamos aqui para ajudar você!</p>
      </div>
    </section>

    <section class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <h2 class="section-title text-center mb-4">Entre em Contato</h2>
              <form action="https://formsubmit.co/nexussaude2024@gmail.com" method="POST"
                @submit.prevent="handleFormSubmit">
                <div class="mb-4">
                  <label for="name" class="form-label fw-bold">Seu Nome</label>
                  <input type="text" class="form-control form-control-lg" id="name" placeholder="Digite seu nome"
                    name="name" required />
                </div>

                <div class="mb-4">
                  <label for="email" class="form-label fw-bold">Seu E-mail</label>
                  <input type="email" class="form-control form-control-lg" id="email" placeholder="Digite seu e-mail"
                    name="email" required />
                </div>

                <div class="mb-4">
                  <label for="message" class="form-label fw-bold">Sua Mensagem</label>
                  <textarea class="form-control form-control-lg" id="message" rows="5" placeholder="Digite sua mensagem"
                    name="message" required></textarea>
                </div>

                <input type="hidden" name="_subject" value="Nova mensagem do site Nexus Saúde!" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value="/" />

                <div class="text-center">
                  <button type="submit" class="btn btn-success btn-lg px-5 shadow-sm">
                    Enviar Mensagem
                  </button>
                </div>
              </form>
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
    handleFormSubmit(event) {
      const form = event.target;

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      })
        .then(response => {
          if (response.ok) {
            alert("Mensagem enviada com sucesso!");
            this.$router.push('/');
          } else {
            alert("Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.");
          }
        })
        .catch(error => {
          alert("Houve um problema com o envio do formulário.");
        });
    }
  }
};
</script>

<style scoped>
.banner {
  background: linear-gradient(rgb(26, 26, 60), rgb(26, 26, 60)),
    url("/src/assets/img/fale_conosco_fundo.jpg") no-repeat center center;
  background-size: cover;
  height: 50vh;
  color: #fff;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}

.banner-content h1 {
  font-weight: bold;
  letter-spacing: 2px;
}

.banner-content p {
  font-size: 1.2rem;
}

.card {
  background-color: #f8f9fa;
  border: none;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 8px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.form-control:focus {
  box-shadow: 0 0 8px rgba(83, 186, 131, 0.7);
  border-color: #53ba83;
  transform: scale(1.02);
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #3e9c6e;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  position: relative;
}

.section-title::after {
  content: "";
  width: 50px;
  height: 3px;
  background-color: #53ba83;
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}
</style>