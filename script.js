/* ==========================================================================
   PUREAGRO – TECNOLOGIA E SUSTENTABILIDADE (CONCURSO AGRINHO 2026)
   LÓGICA INTERATIVA INTERNA - VANILLA JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. PLAYER DE MÚSICA AMBIENTE
    // ==========================================
    const btnMusica = document.getElementById("btn-musica");
    const audioFundo = document.getElementById("audio-fundo");

    if (btnMusica && audioFundo) {
        // Reduz o volume para ficar uma música de fundo suave e agradável
        audioFundo.volume = 0.2; 

        btnMusica.addEventListener("click", () => {
            if (audioFundo.paused) {
                audioFundo.play().then(() => {
                    btnMusica.innerHTML = "⏸️ Pausar Som do Campo";
                    btnMusica.setAttribute("aria-pressed", "true");
                }).catch(err => console.log("Áudio bloqueado pelo navegador. Requer interação prévia."));
            } else {
                audioFundo.pause();
                btnMusica.innerHTML = "🎵 Ouvir o Som do Campo";
                btnMusica.setAttribute("aria-pressed", "false");
            }
        });
    }

    // ==========================================
    // 2. PAINEL DE ESTATÍSTICAS ANIMADAS (CONTADORES)
    // ==========================================
    const contadores = document.querySelectorAll(".numero-contador");
    
    const animarContadores = () => {
        contadores.forEach(contador => {
            const atualizarContador = () => {
                const alvo = +contador.getAttribute("data-alvo");
                const valorAtual = +contador.innerText;
                
                // Define a velocidade da animação com base no tamanho do número
                const incremento = alvo / 50; 

                if (valorAtual < alvo) {
                    contador.innerText = Math.ceil(valorAtual + incremento);
                    setTimeout(atualizarContador, 25);
                } else {
                    contador.innerText = alvo;
                }
            };
            atualizarContador();
        });
    };

    // Ativa os contadores usando o IntersectionObserver quando o usuário rolar até a seção
    const secaoEstatistica = document.getElementById("estatisticas");
    if (secaoEstatistica) {
        const observador = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animarContadores();
                    observador.unobserve(entry.target); // Anima apenas uma vez
                }
            });
        }, { threshold: 0.4 });
        observador.observe(secaoEstatistica);
    }

    // ==========================================
    // 3. MAPA INTERATIVO (PARANÁ E BRASIL)
    // ==========================================
    const tabPR = document.getElementById("tab-pr");
    const tabBR = document.getElementById("tab-br");
    const containerRegioes = document.getElementById("container-regioes");
    const nomeRegiao = document.getElementById("nome-regiao");
    const descricaoRegiao = document.getElementById("descricao-regiao");
    const metricasRegiao = document.getElementById("metricas-regiao");
    const culturaTxt = document.getElementById("cultura-txt");
    const focoTxt = document.getElementById("foco-txt");

    // Banco de dados dinâmico do mapa
    const dadosMapa = {
        pr: {
            "norte-pr": { nome: "Norte do Paraná", cultura: "Café, Milho e Soja", foco: "Manejo integrado de pragas e recuperação de microbacias", desc: "Região histórica com transição para sistemas altamente tecnológicos de rotação de culturas e preservação de solos produtivos." },
            "oeste-pr": { nome: "Oeste do Paraná", cultura: "Soja, Milho e Avicultura", foco: "Uso em larga escala de Biogás e Biomassa", desc: "Referência mundial em cooperativismo. Transforma resíduos da pecuária e agricultura em energia limpa e biofertilizantes." },
            "sul-pr": { nome: "Sul do Paraná", cultura: "Erva-Mate, Feijão e Silvicultura", foco: "Sistemas Agroflorestais e Agricultura Familiar", desc: "Destaca-se pela produção integrada com a preservação da Mata de Araucárias nativa e técnicas agrícolas tradicionais harmoniosas." }
        },
        br: {
            "norte-pr": { nome: "Região Centro-Oeste", cultura: "Algodão, Soja e Milho", foco: "Agricultura de Precisão e Carbono Neutro", desc: "Grandes extensões que lideram o uso de rastreabilidade via satélite e mitigação de emissões de gases de efeito estufa." },
            "oeste-pr": { nome: "Região Nordeste", cultura: "Fruticultura Irrigada e Algodão", foco: "Irrigação por Gotejamento Automatizado", desc: "O Vale do São Francisco demonstra como a tecnologia de microirrigação economiza água e gera riqueza em áreas semiáridas." },
            "sul-pr": { nome: "Região Sul (Geral)", cultura: "Arroz, Trigo, Soja e Uva", foco: "Plantio Direto e Conservação de Mananciais", desc: "Pioneira na conservação da palhada do solo, focando fortemente na proteção de rios e no controle biológico de pragas." }
        }
    };

    let mapaAtual = "pr"; // Controla qual base de dados ler (PR ou BR)

    const atualizarPontosDoMapa = (tipo) => {
        const botoesPontos = containerRegioes.querySelectorAll(".regiao-ponto");
        if (tipo === "pr") {
            botoesPontos[0].innerText = "Norte do PR";
            botoesPontos[1].innerText = "Oeste do PR";
            botoesPontos[2].innerText = "Sul do PR";
        } else {
            botoesPontos[0].innerText = "Centro-Oeste";
            botoesPontos[1].innerText = "Nordeste";
            botoesPontos[2].innerText = "Região Sul";
        }
        
        // Reseta o card lateral informativo
        nomeRegiao.innerText = "Selecione uma Região";
        descricaoRegiao.innerText = "Clique em um dos pontos do mapa ao lado para visualizar os dados detalhados.";
        metricasRegiao.classList.add("hidden");
        botoesPontos.forEach(p => p.classList.remove("ativa-ponto"));
    };

    if (tabPR && tabBR) {
        tabPR.addEventListener("click", () => {
            mapaAtual = "pr";
            tabPR.classList.add("ativa");
            tabBR.classList.remove("ativa");
            atualizarPontosDoMapa("pr");
        });

        tabBR.addEventListener("click", () => {
            mapaAtual = "br";
            tabBR.classList.add("ativa");
            tabPR.classList.remove("ativa");
            atualizarPontosDoMapa("br");
        });
    }

    if (containerRegioes) {
        containerRegioes.addEventListener("click", (e) => {
            if (e.target.classList.contains("regiao-ponto")) {
                // Remove destaque dos outros pontos
                containerRegioes.querySelectorAll(".regiao-ponto").forEach(p => p.classList.remove("ativa-ponto"));
                // Destaca o ponto clicado
                e.target.classList.add("ativa-ponto");

                const IDRegiao = e.target.getAttribute("data-regiao");
                const informacoes = dadosMapa[mapaAtual][IDRegiao];

                if (informacoes) {
                    nomeRegiao.innerText = informacoes.nome;
                    descricaoRegiao.innerText = informacoes.desc;
                    culturaTxt.innerText = informacoes.culture || informacoes.cultura;
                    focoTxt.innerText = informacoes.foco;
                    metricasRegiao.classList.remove("hidden");
                }
            }
        });
    }

    // ==========================================
    // 4. ECO-CALCULADORA SUSTENTÁVEL
    // ==========================================
    const btnCalcular = document.getElementById("btn-calcular");
    const resultadoPainel = document.getElementById("resultado-calculadora");

    if (btnCalcular) {
        btnCalcular.addEventListener("click", () => {
            const area = parseFloat(document.getElementById("tamanho-area").value);
            const manejo = document.getElementById("tipo-manejo").value;

            if (!area || area <= 0 || !manejo) {
                alert("Por favor, preencha todos os campos da calculadora corretamente!");
                return;
            }

            let economiaAguaPorHectare = 0;
            let carbonoRetidoPorHectare = 0;
            let nivelSustentabilidade = "";

            // Lógica e cálculos simulados com base científica real de manejo agrícola
            switch (manejo) {
                case "convencional":
                    economiaAguaPorHectare = 0;
                    carbonoRetidoPorHectare = -50; // Impacto negativo
                    nivelSustentabilidade = "Crítico (Manejo tradicional com alto desgaste)";
                    break;
                case "precisao":
                    economiaAguaPorHectare = 15000; // Litros por safra
                    carbonoRetidoPorHectare = 120; // kg/CO2
                    nivelSustentabilidade = "Avançado (Excelente uso de recursos hídricos)";
                    break;
                case "direto":
                    economiaAguaPorHectare = 8000;
                    carbonoRetidoPorHectare = 350; // Retém muito carbono na palhada do solo
                    nivelSustentabilidade = "Excelente (Solo protegido e alta fixação de carbono)";
                    break;
                case "total":
                    economiaAguaPorHectare = 22000;
                    carbonoRetidoPorHectare = 500;
                    nivelSustentabilidade = "Nível Campeão Sustentável (Equilíbrio Futurista)";
                    break;
            }

            // Exibe os totais baseados na área informada
            const totalAgua = economiaAguaPorHectare * area;
            const totalCarbono = carbonoRetidoPorHectare * area;

            document.getElementById("res-agua").innerText = totalAgua <= 0 ? "0 Litros" : `${totalAgua.toLocaleString('pt-BR')} Litros`;
            document.getElementById("res-carbono").innerText = `${totalCarbono.toLocaleString('pt-BR')} kg/CO₂`;
            document.getElementById("res-nivel").innerText = nivelSustentabilidade;

            resultadoPainel.classList.remove("hidden");
            resultadoPainel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }

    // ==========================================
    // 5. GERADOR DE CURIOSIDADES ALEATÓRIAS (PARANÁ)
    // ==========================================
    const curiosidades = [
        "O Paraná possui leis rigorosas de proteção a bacias hidrográficas rurais, fazendo com que o agronegócio trabalhe lado a lado com as reservas de água doce do estado.",
        "O Sistema de Plantio Direto, essencial para evitar a erosão, foi consolidado e ganhou força nacional através de testes pioneiros em solo paranaense nos anos 1970.",
        "Mais de 70% das propriedades rurais do Paraná pertencem à Agricultura Familiar, provando que a produção em pequena escala sustenta nossas cidades.",
        "As maiores cooperativas agroindustriais da América Latina estão localizadas no Paraná, investindo milhões anualmente em inovação ecológica e energia renovável.",
        "O Concurso Agrinho foi criado no Paraná e promove há décadas a conscientização ambiental entre as gerações que representam o futuro do campo."
    ];

    const btnCuriosidade = document.getElementById("btn-proxima-curiosidade");
    const textoCuriosidade = document.getElementById("texto-curiosidade");

    if (btnCuriosidade && textoCuriosidade) {
        btnCuriosidade.addEventListener("click", () => {
            // Sorteia um índice do array diferente do atual de forma simples
            const indiceAleatorio = Math.floor(Math.random() * curiosidades.length);
            textoCuriosidade.style.opacity = 0;
            
            setTimeout(() => {
                textoCuriosidade.innerText = curiosidades[indiceAleatorio];
                textoCuriosidade.style.opacity = 1;
            }, 200);
        });
    }

    // ==========================================
    // 6. GALERIA INTERATIVA (CARROSSEL)
    // ==========================================
    const itensCarrossel = document.querySelectorAll(".carrossel-item");
    const btnPrev = document.getElementById("carrossel-prev");
    const btnNext = document.getElementById("carrossel-next");
    let slideAtual = 0;

    const mostrarSlide = (indice) => {
        itensCarrossel.forEach(item => item.classList.remove("ativo"));
        
        if (indice >= itensCarrossel.length) slideAtual = 0;
        else if (indice < 0) slideAtual = itensCarrossel.length - 1;
        else slideAtual = indice;

        itensCarrossel[slideAtual].classList.add("ativo");
    };

    if (btnPrev && btnNext && itensCarrossel.length > 0) {
        btnNext.addEventListener("click", () => mostrarSlide(slideAtual + 1));
        btnPrev.addEventListener("click", () => mostrarSlide(slideAtual - 1));

        // Rotação automática a cada 6 segundos para dinamismo visual
        setInterval(() => {
            mostrarSlide(slideAtual + 1);
        }, 6000);
    }

    // ==========================================
    // 7. ASSISTENTE VIRTUAL INTERATIVO (MASCOTE)
    // ==========================================
    const assistente = document.getElementById("assistente-virtual");
    const textoBalao = document.getElementById("texto-balao");

    const dicasMascote = [
        "Você sabia que os drones agrícolas evitam o desperdício aplicando insumos cirurgicamente apenas onde há pragas?",
        "Navegue até a seção 'Nossa Essência' para conhecer a história inspiradora da minha família com a terra!",
        "Faça uma simulação na nossa Eco-Calculadora e descubra quanta água a automação no campo pode economizar.",
        "O equilíbrio perfeito existe: produzir em abundância mantendo as florestas em pé e saudáveis!",
        "Confira a nossa Linha do Tempo para ver o salto gigante que demos da força braçal até a Inteligência Artificial!"
    ];

    if (assistente && textoBalao) {
        assistente.addEventListener("click", () => {
            const dicaAleatoria = Math.floor(Math.random() * dicasMascote.length);
            textoBalao.innerText = dicasMascote[dicaAleatoria];
            
            // Pequeno efeito visual de balanço no avatar ao interagir
            const avatar = assistente.querySelector(".mascote-avatar");
            avatar.style.transform = "scale(1.2) rotate(10deg)";
            setTimeout(() => {
                avatar.style.transform = "";
            }, 300);
        });
    }

    // ==========================================
    // 8. MENU HAMBÚRGUER (RESPONSIVIDADE MÓVEL)
    // ==========================================
    const menuHamburguer = document.querySelector(".menu-hamburguer");
    const listaMenu = document.querySelector(".lista-menu");

    if (menuHamburguer && listaMenu) {
        menuHamburguer.addEventListener("click", () => {
            const expandido = menuHamburguer.getAttribute("aria-expanded") === "true" || false;
            menuHamburguer.setAttribute("aria-expanded", !expandido);
            listaMenu.classList.toggle("hidden"); // Alterna visualização no mobile
        });
    }
});

