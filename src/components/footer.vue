<template>
    <footer>
        <div class="container">
            <div class="footer-section left">
                <div class="footer-logo-container">
                    <img src="/src/assets/img/NexusSaude_icon.png" alt="Nexus Saúde Logo" class="footer-logo"
                        loading="lazy">
                    <h2 class="footer-title">Nexus Saúde</h2>
                </div>
                <ul class="contact-info">
                    <li><i class="bi bi-telephone"></i> (81) 3661-0000</li>
                    <li><i class="bi bi-envelope"></i> nexussaude2024@gmail.com</li>
                    <li><i class="bi bi-geo-alt"></i> Rua das Palmeiras, 123 - Centro, Palmares - PE</li>
                </ul>
            </div>

            <div class="footer-section center">
                <h5>Links úteis</h5>
                <ul class="nav-links">
                    <li><router-link to="/" aria-label="Ir para página inicial">Home</router-link></li>
                    <li><router-link to="/sobre" aria-label="Conheça mais sobre nós">Quem Somos</router-link></li>
                    <li><router-link to="/contato" aria-label="Entre em contato conosco">Fale Conosco</router-link></li>
                    <li><router-link to="/servicos" aria-label="Nossos serviços">Nossos Serviços</router-link></li>
                    <li><router-link to="/politica-privacidade" aria-label="Política de privacidade">Política de
                            Privacidade</router-link></li>
                </ul>
            </div>

            <div class="footer-section right">
                <h5>Acompanhe nossas redes</h5>
                <div class="social-media">
                    <a href="https://github.com/Ericlecio/Nexus-Saude" target="_blank" aria-label="GitHub"><i
                            class="bi bi-github"></i></a>
                    <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                    <a href="#" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
                    <a href="#" aria-label="Twitter"><i class="bi bi-x"></i></a>
                </div>

                <div class="newsletter-form">
                    <h5>Receba nossas novidades</h5>
                    <p>Inscreva-se para receber atualizações</p>
                    <div class="input-group">
                        <input type="email" v-model="email" placeholder="Digite seu e-mail"
                            aria-label="Digite seu e-mail para newsletter" @keyup.enter="subscribe">
                        <button class="btn-subscribe" @click="subscribe">
                            Inscrever
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="back-to-top">
            <a href="#" @click.prevent="scrollToTop" aria-label="Voltar ao topo da página">
                <i class="bi bi-arrow-up-circle"></i> Voltar ao topo
            </a>
        </div>

        <div class="copyright">
            © {{ currentYear }} Nexus Saúde. Todos os direitos reservados.
        </div>

        <transition name="fade">
            <div v-if="showNotification" class="notification" :class="notificationType">
                {{ notificationMessage }}
            </div>
        </transition>
    </footer>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            showNotification: false,
            notificationMessage: '',
            notificationType: 'success',
            currentYear: new Date().getFullYear()
        }
    },
    methods: {
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        subscribe() {
            if (!this.email) {
                this.showNotification = true;
                this.notificationMessage = 'Por favor, digite seu e-mail';
                this.notificationType = 'error';
                this.hideNotification();
                return;
            }

            if (!this.validateEmail(this.email)) {
                this.showNotification = true;
                this.notificationMessage = 'Por favor, digite um e-mail válido';
                this.notificationType = 'error';
                this.hideNotification();
                return;
            }

            // Simular envio para API
            this.showNotification = true;
            this.notificationMessage = 'Inscrição realizada com sucesso!';
            this.notificationType = 'success';
            this.email = '';
            this.hideNotification();
        },
        validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        hideNotification() {
            setTimeout(() => {
                this.showNotification = false;
            }, 3000);
        }
    }
};
</script>

<style scoped>
footer {
    background: linear-gradient(135deg, #1a1a3c, #13132b);
    color: #fff;
    padding: 50px 20px 30px;
    font-size: 0.9rem;
    position: relative;
    overflow: hidden;
}

footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00ff9d, #53ba83, #1565c0);
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
    gap: 30px;
}

.footer-section {
    flex: 1;
    min-width: 280px;
    max-width: 350px;
}

.left {
    text-align: left;
}

.center {
    text-align: center;
}

.right {
    text-align: right;
}

.footer-logo-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.footer-logo {
    width: auto;
    height: 60px;
    filter: drop-shadow(0px 0px 10px rgba(0, 255, 157, 0.4));
}

.footer-title {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #00ff9d;
    margin: 0;
}

.contact-info {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.contact-info li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
    line-height: 1.5;
}

.contact-info i {
    color: #00ff9d;
    margin-right: 10px;
    min-width: 20px;
    font-size: 1.1rem;
    margin-top: 3px;
}

.nav-links {
    list-style: none;
    padding: 0;
    margin: 20px 0;
}

.nav-links li {
    margin-bottom: 12px;
}

.nav-links li a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: inline-block;
    padding: 5px 0;
    position: relative;
}

.nav-links li a:hover {
    color: #00ff9d;
}

.nav-links li a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #00ff9d;
    transition: width 0.3s ease;
}

.nav-links li a:hover::after {
    width: 100%;
}

.social-media {
    display: flex;
    gap: 15px;
    margin: 25px 0;
    justify-content: flex-end;
}

.social-media a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    color: #00ff9d;
    font-size: 1.3rem;
    transition: all 0.3s ease;
}

.social-media a:hover {
    background-color: #00ff9d;
    color: #03052b;
    transform: translateY(-5px);
}

.newsletter-form {
    margin-top: 20px;
}

.newsletter-form h5 {
    margin-bottom: 15px;
    color: #00ff9d;
}

.newsletter-form p {
    margin-bottom: 15px;
    opacity: 0.9;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.input-group input {
    flex: 1;
    padding: 12px 15px;
    border: none;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    transition: all 0.3s ease;
}

.input-group input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.input-group input:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 2px #00ff9d;
}

.btn-subscribe {
    background-color: #00ff9d;
    color: #03052b;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.btn-subscribe:hover {
    background-color: #00e68a;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.back-to-top {
    margin-top: 40px;
    text-align: center;
    animation: fadeIn 1s ease-in-out;
}

.back-to-top a {
    color: #00ff9d;
    text-decoration: none;
    font-size: 1.1rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    font-weight: 600;
    padding: 8px 20px;
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0.2);
}

.back-to-top a:hover {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.3);
    transform: translateY(-3px);
}

.copyright {
    text-align: center;
    padding-top: 30px;
    margin-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.85rem;
    opacity: 0.8;
}

.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    font-weight: 600;
    z-index: 1000;
}

.notification.success {
    background-color: #00ff9d;
    color: #03052b;
}

.notification.error {
    background-color: #ff6b6b;
    color: #fff;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 992px) {
    .container {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .footer-section {
        max-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .left,
    .center,
    .right {
        text-align: center;
    }

    .contact-info li {
        justify-content: center;
    }

    .social-media {
        justify-content: center;
    }

    .input-group {
        flex-direction: column;
    }

    .btn-subscribe {
        width: 100%;
    }
}

@media (max-width: 768px) {
    footer {
        padding: 40px 15px 20px;
    }

    .footer-logo {
        height: 50px;
    }

    .back-to-top a {
        font-size: 1rem;
    }

    .copyright {
        font-size: 0.8rem;
    }
}
</style>