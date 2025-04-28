<script>
export default {
    methods: {
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        subscribe() {
            alert("Inscrição realizada com sucesso!");
        }
    }
};
</script>

<template>
    <footer>
        <div class="container">
            <div class="footer-section left">
                <img src="/src/assets/img/NexusSaude_icon.png" alt="Nexus Saúde Logo" class="footer-logo">
                <p><i class="bi bi-telephone"></i> (81) 3661-0000</p>
                <p><i class="bi bi-envelope"></i> nexussaude2024@gmail.com</p>
                <p><i class="bi bi-geo-alt"></i> Rua das Palmeiras, 123 - Centro, Palmares - PE</p>
            </div>

            <div class="footer-section center">
                <h5>Links úteis</h5>
                <ul class="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/sobre">Quem Somos</a></li>
                    <li><a href="/contato">Fale Conosco</a></li>
                </ul>
            </div>

            <div class="footer-section right">
                <h5>Acompanhe nossas redes</h5>
                <div class="social-media">
                    <a href="https://github.com/Ericlecio/Nexus-Saude" target="blank"><i class="bi bi-github"></i></a>
                    <a href="#"><i class="bi bi-instagram"></i></a>
                    <a href="#"><i class="bi bi-whatsapp"></i></a>
                    <a href="#"><i class="bi bi-x"></i></a>
                </div>
            </div>
        </div>

        <div class="back-to-top">
            <a href="#" @click.prevent="scrollToTop">
                <i class="bi bi-arrow-up-circle"></i> Voltar ao topo
            </a>
        </div>

        <div class="text-center mt-3 copyright">
            © 2024 Nexus Saúde. Todos os direitos reservados.
        </div>
    </footer>
</template>

<style scoped>
footer {
    background: linear-gradient(135deg, #1a1a3c, #13132b);
    color: #fff;
    padding: 50px 20px;
    font-size: 0.9rem;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: auto;
    gap: 30px;
}

.footer-section {
    flex: 1;
    min-width: 280px;
    max-width: 350px;
}

.footer-logo {
    width: auto;
    max-width: 80px;
    height: auto;
    margin-bottom: 15px;
    filter: drop-shadow(0px 0px 10px rgba(0, 255, 157, 0.4));
}

.center {
    text-align: center;
}

.right {
    text-align: right;
}

.nav-links {
    list-style: none;
    padding: 0;
}

.nav-links li {
    margin-bottom: 10px;
}

.nav-links li a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    transition: color 0.3s ease, transform 0.3s ease;
}

.nav-links li a:hover {
    color: #00ff9d;
    transform: translateX(5px);
}

.social-media {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 10px;
}

.social-media a {
    color: #00ff9d;
    font-size: 1.8rem;
    transition: transform 0.3s ease, color 0.3s ease;
}

.social-media a:hover {
    transform: scale(1.3) rotate(5deg);
    color: #fff;
}

.back-to-top {
    margin-top: 30px;
    text-align: center;
    animation: fadeIn 1s ease-in-out;
}

.back-to-top a {
    color: #00ff9d;
    text-decoration: none;
    font-size: 1.2rem;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: color 0.3s ease, transform 0.3s ease;
}

.back-to-top a:hover {
    color: #fff;
    transform: translateY(-5px);
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

.copyright {
    font-size: 0.8rem;
    margin-top: 20px;
    opacity: 0.8;
}

@media (max-width: 992px) {
    .container {
        flex-direction: column;
        text-align: center;
        align-items: center;
    }

    .footer-section {
        max-width: 100%;
    }

    .social-media {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    footer {
        padding: 30px 10px;
    }

    .footer-logo {
        max-width: 60px;
        margin: 10px auto;
    }

    .left,
    .center,
    .right {
        text-align: center;
    }

    .nav-links li {
        margin: 8px 0;
    }

    .social-media {
        justify-content: center;
        gap: 15px;
    }

    .social-media a {
        font-size: 1.5rem;
    }

    .back-to-top {
        margin-top: 20px;
    }

    .back-to-top a {
        font-size: 1rem;
    }

    .copyright {
        font-size: 0.75rem;
        padding: 10px;
    }
}
</style>