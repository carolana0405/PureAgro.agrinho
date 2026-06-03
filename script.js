document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SISTEMA DE AUDIO (Música Ambiente Opcional)
       ========================================================================== */
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');

    // Configura o volume inicial baixo para manter a suavidade
    bgMusic.volume = 0.25;

    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                musicBtn.querySelector('.text').textContent = 'Música Ativa';
            }).catch(err => {
                console.log("Interação prévia do usuário necessária para tocar o áudio.", err);
            });
        } else {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            musicBtn.querySelector('.text').textContent = 'Ouvir o Campo';
        }
    });

    /* ==========================================================================
       2. SCROLL REVEAL (Animações Suaves de Entrada)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Execução inicial preventiva

    /* ==========================================================================
       3. CONTADORES ANIMADOS (Estatísticas)
       ========================================================================== */
    const counterSection = document.querySelector('.counter-section');
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = target / 60; // Ajusta a velocidade de incremento proporcionalmente
            
            const updateCount = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + speed);
                    setTimeout(updateCount, 25);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Monitora o scroll para ativar os números somente ao entrar na tela
    const monitorCounterScroll = () => {
        if (!counterSection) return;
        const sectionPos = counterSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight * 0.9;
        
        if (sectionPos < screenPos && !countersStarted) {
            countersStarted = true;
            startCounters();
        }
    };
    window.addEventListener('scroll', monitorCounterScroll);

    /* ==========================================================================
       4. MAPA INTERATIVO (Dados Dinâmicos das Regiões)
       ========================================================================== */
    const mapButtons = document.querySelectorAll('.map-btn');
    const mapDisplay = document.getElementById('mapDisplay');

    const regionData = {
        'pr-norte': {
            title: "Norte do Paraná",
            desc: "Região historicamente conhecida pelo café, hoje totalmente diversificada com tecnologia avançada.",
            prod: "Soja, Milho, Trigo e Fruticultura especializada.",
            curiosity: "Utilização pioneira de monitoramento via satélite para controle de cooperativas de pequenos produtores familiares."
        },
        'pr-oeste': {
            title: "Oeste do Paraná",
            desc: "A potência nacional em cooperativismo de produção agroindustrial de proteína animal e grãos.",
            prod: "Aves, Suínos, Milho e Piscicultura integrada (Tilápia).",
            curiosity: "Líder no uso de biodigestores em granjas para transformar dejetos animais em biogás e energia elétrica limpa."
        },
        'pr-sul': {
            title: "Sul e Campos Gerais",
            desc: "Ponto de referência em conservação e rotação sustentável de culturas de inverno e pecuária leiteira de ponta.",
            prod: "Leite de alta qualidade, Batata, Cevada e Trigo.",
            curiosity: "Berço do Sistema de Plantio Direto no Brasil, mantendo o solo protegido há mais de 50 anos consecutivamente."
        },
        'br-co': {
            title: "Centro-Oeste Brasileiro",
            desc: "O celeiro de exportação de grãos do país, focado na transição para a Agricultura de Precisão em larga escala.",
            prod: "Soja, Algodão e Pecuária de Corte Extensiva/Intensiva.",
            curiosity: "Fazendas utilizam aviões e drones de altíssima autonomia operados por IA para controle preciso e biológico de pragas."
        },
        'br-ne': {
            title: "Nordeste (Região MATOPIBA)",
            desc: "A grande fronteira agrícola moderna que cresce verticalmente baseada em tecnologia pesada de otimização de solos.",
            prod: "Algodão, Soja e Grãos diversos.",
            curiosity: "Sensores subterrâneos profundos gerenciam o estresse hídrico das plantas para aproveitar cada gota nos ciclos de chuva escassa."
        }
    };

    mapButtons.forEach(button => {
        button.addEventListener('click', () => {
            mapButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            const regionKey = button.getAttribute('data-region');
            const data = regionData[regionKey];

            if (data) {
                mapDisplay.innerHTML = `
                    <div class="region-info-box fade-in">
                        <h4>📍 ${data.title}</h4>
                        <p>${data.desc}</p>
                        <ul>
                            <li><strong>Principais Culturas:</strong> ${data.prod}</li>
                            <li><strong>Fator Sustentável:</strong> ${data.curiosity}</li>
                        </ul>
                    </div>
                `;
            }
        });
    });

    /* ==========================================================================
       5. CALCULADORA DE PEGADA AMBIENTAL MULTI-STEPS
       ========================================================================== */
    const steps = document.querySelectorAll('.quiz-step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    const quizForm = document.getElementById('footprintForm');
    const quizResult = document.getElementById('quizResult');
    let currentStep = 0;

    const updateStepView = () => {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx === currentStep);
        });

        prevBtn.disabled = currentStep === 0;

        if (currentStep === steps.length - 1) {
            nextBtn.classList.add('hide');
            submitQuizBtn.classList.remove('hide');
        } else {
            nextBtn.classList.remove('hide');
            submitQuizBtn.classList.add('hide');
        }
    };

    nextBtn.addEventListener('click', () => {
        // Validação simples se o campo atual está preenchido
        const currentInputs = steps[currentStep].querySelectorAll('input[type="radio"]');
        let answered = false;
        currentInputs.forEach(input => { if(input.checked) answered = true; });

        if(!answered) {
            alert("Por favor, selecione uma opção para continuar!");
            return;
        }

        if (currentStep < steps.length - 1) {
            currentStep++;
            updateStepView();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepView();
        }
    });

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(quizForm);
        let totalScore = 0;

        for (let value of formData.values()) {
            totalScore += parseInt(value);
        }

        quizForm.classList.add('hide');
        quizResult.classList.remove('hide');

        let evaluation = "";
        let advice = "";

        if (totalScore <= 35) {
            evaluation = "Pegada Sustentável Excelente! 🌱";
            advice = "Suas escolhas urbanas apoiam perfeitamente o produtor rural consciente. Você consome alimentos locais, evita o desperdício severo e valoriza a manutenção correta da cadeia biológica. Continue sendo um exemplo!";
        } else if (totalScore <= 60) {
            evaluation = "Pegada Ambiental Moderada ⚠️";
            advice = "Você está no caminho certo, mas pode melhorar a sintonia com o campo. Tente prestar mais atenção à origem dos produtos no mercado (priorize feiras locais e cooperativas) e combata o desperdício doméstico.";
        } else {
            evaluation = "Pegada de Consumo Alta 🚨";
            advice = "Suas escolhas diárias geram sobrecarga desnecessária na cadeia produtiva. O consumo excessivo de ultraprocessados e o alto índice de desperdício exigem mais recursos naturais do solo e da água do campo. Que tal começarmos mudando pequenos hábitos hoje?";
        }

        quizResult.innerHTML = `
            <div class="fade-in">
                <h4>Resultado da Análise</h4>
                <div class="result-score">${totalScore} Pontos</div>
                <p><strong>${evaluation}</strong></p>
                <p style="margin-top: 15px; font-size: 0.95rem; text-align: justify;">${advice}</p>
                <button type="button" onclick="window.location.reload()" class="btn-primary" style="margin-top:20px;">Refazer Teste</button>
            </div>
        `;
    });

    /* ==========================================================================
       6. CARROSSEL DE IMAGENS NATIVO
       ========================================================================== */
    const slides = document.querySelectorAll('.carousel-slide');
    const caroPrev = document.getElementById('caroPrev');
    const caroNext = document.getElementById('caroNext');
    let currentSlide = 0;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides[currentSlide].classList.add('active');
    };

    caroNext.addEventListener('click', () => showSlide(currentSlide + 1));
    caroPrev.addEventListener('click', () => showSlide(currentSlide - 1));

    // Carrossel Automático Suave (Troca a cada 6 segundos)
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 6000);

    /* ==========================================================================
       7. ASSISTENTE VIRTUAL (PURE - FAQs Interativas)
       ========================================================================== */
    const faqButtons = document.querySelectorAll('.faq-btn');
    const responseArea = document.getElementById('assistantResponse');

    const pureResponses = {
        'oque-e': "A *Agricultura de Precisão* consiste em gerenciar a lavoura metro a metro, em vez de tratá-la como uma área única e uniforme. Usando GPS, sensores e dados, aplicamos fertilizantes ou água apenas onde realmente há necessidade. É o cérebro da tecnologia protegendo o bolso do produtor e o ecossistema!",
        'agrinho': "O *Concurso Agrinho* é o maior programa de responsabilidade social e ambiental da FAEP. Há décadas ele incentiva estudantes e professores a pensarem em soluções éticas, sustentáveis e inovadoras para o campo, integrando a inteligência da escola com a prática das fazendas.",
        'tecnologia': "Pelo contrário! A tecnologia de ponta traz o jovem de volta ao campo. Hoje, gerenciar uma fazenda exige conhecimentos em robótica, análise de dados e biologia avançada. Isso gera empregos qualificados no interior, impedindo o êxodo rural forçado.",
        'equilibrio': "Produzimos sem desmatar através do aumento da eficiência vertical! Técnicas como o plantio direto, rotação de culturas e a recuperação de pastagens degradadas permitem dobrar a colheita no mesmo pedaço de chão que meu avô usava, protegendo integralmente as matas nativas."
    };

    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const questionKey = btn.getAttribute('data-question');
            const reply = pureResponses[questionKey];

            if (reply) {
                responseArea.classList.remove('hidden');
                // Formatação simples simulando markdown básico para negrito
                responseArea.innerHTML = <p class="fade-in">🤖🌾 <strong>PURE diz:</strong> ${reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>;
            }
        });
    });
});