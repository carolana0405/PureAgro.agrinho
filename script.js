document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SISTEMA DE ÁUDIO SUAVE
       ========================================================================== */
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    if(bgMusic) bgMusic.volume = 0.20;

    if(musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicBtn.classList.add('playing');
                    musicBtn.querySelector('.text').textContent = 'Música Ativa';
                }).catch(() => console.log("Interação necessária para ativar áudio."));
            } else {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
                musicBtn.querySelector('.text').textContent = 'Ouvir o Campo';
            }
        });
    }

    /* ==========================================================================
       2. BOTÃO VOLTAR AO TOPO
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================================
       3. ANIMATION SCROLL REVEAL (Correção de Visualização das Seções)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.88;
        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Execução imediata pós carregamento

    /* ==========================================================================
       4. CONTADORES NUMÉRICOS ANIMADOS
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = target / 40;
            const updateCount = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + speed);
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    window.addEventListener('scroll', () => {
        const targetSec = document.getElementById('explorar');
        if(!targetSec) return;
        const pos = targetSec.getBoundingClientRect().top;
        if(pos < window.innerHeight * 0.8 && !countersStarted) {
            countersStarted = true;
            startCounters();
        }
    });

    /* ==========================================================================
       5. MAPA INTERATIVO (Dados Dinâmicos do Paraná e Fronteiras)
       ========================================================================== */
    const mapButtons = document.querySelectorAll('.map-btn');
    const mapDisplay = document.getElementById('mapDisplay');

    const regionData = {
        'pr-norte': {
            title: "Norte do Paraná",
            desc: "Região forte no cultivo tradicional e tecnológico de grãos e fruticultura de alto rendimento.",
            curiosity: "Destaque no monitoramento cooperativo de pragas por pequenos produtores que usam alertas digitais compartilhados."
        },
        'pr-oeste': {
            title: "Oeste Paranaense",
            desc: "Referência absoluta em cooperativismo de grande escala para processamento de proteína animal e piscicultura.",
            curiosity: "Pioneiro na transformação de dejetos de biomassa animal em biogás de energia limpa para abastecer granjas."
        },
        'pr-sul': {
            title: "Campos Gerais e Sul",
            desc: "Ponto forte da bacia leiteira paranaense de alta qualidade e grãos de inverno.",
            curiosity: "Berço nacional e capital do Sistema de Plantio Direto, mantendo solos protegidos e ricos organicamente."
        }
    };

    mapButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            mapButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const key = btn.getAttribute('data-region');
            const data = regionData[key];
            if(data) {
                mapDisplay.innerHTML = `
                    <div class="fade-in">
                        <h4>📍 ${data.title}</h4>
                        <p style="font-size:0.95rem; margin-bottom:8px;">${data.desc}</p>
                        <p><strong>Fator Sustentável:</strong> ${data.curiosity}</p>
                    </div>
                `;
            }
        });
    });

    /* ==========================================================================
       6. CALCULADORA DE PEGADA AMBIENTAL MULTI-ETAPAS
       ========================================================================== */
    const steps = document.querySelectorAll('.quiz-step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    const quizForm = document.getElementById('footprintForm');
    const quizResult = document.getElementById('quizResult');
    let currentStep = 0;

    const updateStep = () => {
        steps.forEach((st, i) => st.classList.toggle('active', i === currentStep));
        prevBtn.disabled = currentStep === 0;
        if(currentStep === steps.length - 1) {
            nextBtn.classList.add('hide');
            submitQuizBtn.classList.remove('hide');
        } else {
            nextBtn.classList.remove('hide');
            submitQuizBtn.classList.add('hide');
        }
    };

    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const inputs = steps[currentStep].querySelectorAll('input[type="radio"]');
            let filled = false;
            inputs.forEach(i => { if(i.checked) filled = true; });
            if(!filled) { alert("Por favor, selecione uma resposta para avançar!"); return; }
            currentStep++;
            updateStep();
        });
        prevBtn.addEventListener('click', () => { currentStep--; updateStep(); });
    }

    if(quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(quizForm);
            let score = 0;
            for(let v of data.values()) score += parseInt(v);

            quizForm.classList.add('hide');
            quizResult.classList.remove('hide');

            let titleEval = "";
            let textEval = "";

            if(score <= 30) {
                titleEval = "Pegada Perfeita e Sustentável! 🌱";
                textEval = "Seus hábitos mostram um profundo respeito com a cadeia do campo. Ao escolher pequenos produtores e reduzir o desperdício, você diminui a pressão sobre o uso de recursos como solo e água.";
            } else if(score <= 55) {
                titleEval = "Impacto Moderado ⚠️";
                textEval = "Bom trabalho, mas pequenos ajustes podem diminuir seu peso ambiental. Tente verificar a procedência das suas compras e evitar o desperdício alimentar orgânico na cozinha.";
            } else {
                titleEval = "Alta Pegada de Consumo 🚨";
                textEval = "Seu padrão gera alta pressão na agricultura comercial tradicional. O descarte excessivo de comida e o foco em alimentos pesadamente processados exige maior gasto hídrico e químico nas safras.";
            }

            quizResult.innerHTML = `
                <div class="fade-in">
                    <h4>Resultado do Diagnóstico</h4>
                    <div class="result-score">${score} Pontos</div>
                    <p><strong>${titleEval}</strong></p>
                    <p style="font-size:0.9rem; margin-top:10px; text-align:justify;">${textEval}</p>
                    <button type="button" onclick="window.location.reload()" class="btn-primary" style="margin-top:15px; padding:8px 20px;">Refazer</button>
                </div>
            `;
        });
    }

    /* ==========================================================================
       7. CARROSSEL NATIVO (Slideshow)
       ========================================================================== */
    const slides = document.querySelectorAll('.carousel-slide');
    const caroPrev = document.getElementById('caroPrev');
    const caroNext = document.getElementById('caroNext');
    let cSlide = 0;

    const changeSlide = (idx) => {
        slides.forEach(s => s.classList.remove('active'));
        if(idx >= slides.length) cSlide = 0;
        else if(idx < 0) cSlide = slides.length - 1;
        else cSlide = idx;
        slides[cSlide].classList.add('active');
    };

    if(caroNext && caroPrev) {
        caroNext.addEventListener('click', () => changeSlide(cSlide + 1));
        caroPrev.addEventListener('click', () => changeSlide(cSlide - 1));
        setInterval(() => changeSlide(cSlide + 1), 6000);
    }

    /* ==========================================================================
       8. RESPOSTAS DA MASCOTE PURE
       ========================================================================== */
    const faqButtons = document.querySelectorAll('.faq-btn');
    const assistantResponse = document.getElementById('assistantResponse');

    const answers = {
        'agro': "O segredo está no *Plantio Direto* e no manejo por dados. Deixando a palhada protetora da safra passada intacta, a água da chuva penetra sem causar erosão, nutrindo a microfauna orgânica de modo natural e contínuo.",
        'agrinho': "O *Agrinho* é o principal motor educacional de campo da FAEP, motivando estudantes paranaenses a pesquisar e desenvolver soluções reais e éticas integrando a força urbana com a sabedoria da vida rural."
    };

    faqButtons.forEach(b => {
        b.addEventListener('click', () => {
            const q = b.getAttribute('data-question');
            if(answers[q]) {
                assistantResponse.classList.remove('hidden');
                assistantResponse.innerHTML = <p class="fade-in">🤖🌾 <strong>PURE:</strong> ${answers[q]}</p>;
            }
        });
    });
});