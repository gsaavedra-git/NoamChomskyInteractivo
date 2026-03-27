/* ═══════════════════════════════════════════════════
   CHOMSKY INTERACTIVO — Script
   ═══════════════════════════════════════════════════ */

// ══════════════════════════════════════ PROGRESS BAR
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(window.scrollY / max) * 100}%`;
}, { passive: true });

// ══════════════════════════════════════ NAVBAR
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    // Scrolled style
    navbar.classList.toggle('scrolled', window.scrollY > 50);

    // Active link
    let current = '';
    document.querySelectorAll('section[id], header[id], footer[id]').forEach(el => {
        if (window.scrollY >= el.offsetTop - 120) current = el.id;
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
}, { passive: true });

// ══════════════════════════════════════ HAMBURGER MENU
const hamburger    = document.getElementById('hamburger');
const navLinksEl   = document.getElementById('nav-links');
const mobileOverlay = document.getElementById('mobile-overlay');

function toggleMenu(force) {
    const open = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', open);
    navLinksEl.classList.toggle('open', open);
    mobileOverlay.classList.toggle('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu());
mobileOverlay.addEventListener('click', () => toggleMenu(false));
navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
});

// ══════════════════════════════════════ REVEAL ON SCROLL
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger sibling cards
            const siblings = entry.target.parentElement.querySelectorAll('.reveal');
            let delay = 0;
            siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ══════════════════════════════════════ QUOTE CAROUSEL
const slides       = document.querySelectorAll('.quote-slide');
const dotsContainer = document.getElementById('quote-dots');
let currentSlide   = 0;
let carouselTimer;

slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'q-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Cita ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dotsContainer.children[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dotsContainer.children[currentSlide].classList.add('active');
    resetTimer();
}

function resetTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
}
resetTimer();

// ══════════════════════════════════════ MÓDULO 1: GENERADOR
const generateBtn         = document.getElementById('generateSentenceBtn');
const sentenceOutput      = document.getElementById('sentenceOutput');
const sentenceExplanation = document.getElementById('sentenceExplanation');
const pillSubject         = document.getElementById('pillSubject');
const pillVerb            = document.getElementById('pillVerb');
const pillAdverb          = document.getElementById('pillAdverb');
const pillObject          = document.getElementById('pillObject');

const subjects = ["Un filósofo", "La galaxia", "El algoritmo", "Un gato cuántico", "La teoría", "El lenguaje", "Un poeta ciego"];
const verbs    = ["dibuja", "cantaba", "programa", "observa", "revela", "descifra", "interroga"];
const adverbs  = ["ruidosamente", "melancólicamente", "brillantemente", "silenciosamente", "caóticamente", "inevitablemente", "suavemente"];
const objects  = ["sueños eléctricos", "teorías transparentes", "un silencio perfecto", "futuros posibles", "la nada", "verdades ocultas", "el tiempo perdido"];

const rand = arr => arr[Math.floor(Math.random() * arr.length)];

generateBtn.addEventListener('click', () => {
    const s = rand(subjects);
    const v = rand(verbs);
    const a = rand(adverbs);
    const o = rand(objects);

    // Flash box
    sentenceOutput.style.opacity = '0.4';
    setTimeout(() => {
        sentenceOutput.innerHTML = `${s} <strong>${v}</strong> ${a} ${o}.`;
        sentenceOutput.style.opacity = '1';
    }, 180);

    // Animate pills
    const pillDefs = [
        { el: pillSubject, label: `Sujeto: ${s}`,   cls: 'pill-s' },
        { el: pillVerb,    label: `Verbo: ${v}`,     cls: 'pill-v' },
        { el: pillAdverb,  label: `Adverbio: ${a}`,  cls: 'pill-a' },
        { el: pillObject,  label: `Objeto: ${o}`,    cls: 'pill-o' },
    ];
    pillDefs.forEach((p, i) => {
        p.el.classList.remove('show');
        setTimeout(() => {
            p.el.textContent = p.label;
            p.el.classList.add('show');
        }, 240 + i * 90);
    });

    sentenceExplanation.classList.remove('hidden');
});

// ══════════════════════════════════════ MÓDULO 2: TRANSFORMADOR
const transformBtn        = document.getElementById('transformStructureBtn');
const structureOutput     = document.getElementById('structureOutput');
const structureExplanation = document.getElementById('structureExplanation');
const transformLabel      = document.getElementById('transformLabel');
let isPassive = false;

transformBtn.addEventListener('click', () => {
    structureOutput.style.opacity   = '0';
    structureOutput.style.transform = 'translateY(8px)';

    setTimeout(() => {
        if (isPassive) {
            structureOutput.textContent = 'El medio de comunicación manipuló la noticia.';
            transformLabel.textContent  = 'Forma activa';
        } else {
            structureOutput.textContent = 'La noticia fue manipulada por el medio de comunicación.';
            transformLabel.textContent  = 'Forma pasiva';
        }
        isPassive = !isPassive;
        structureOutput.style.opacity   = '1';
        structureOutput.style.transform = 'translateY(0)';
        structureExplanation.classList.remove('hidden');
    }, 280);
});

// ══════════════════════════════════════ MÓDULO 2: FILTROS / MODAL
const filterCards    = document.querySelectorAll('.filter-card');
const modal          = document.getElementById('modal');
const closeModalBtn  = document.getElementById('close-modal-btn');
const modalTitle     = document.getElementById('modal-title');
const modalText      = document.getElementById('modal-text');

const filterData = {
    '1': {
        title: '🏢 Filtro 1: Propiedad',
        text:  'La noticia presenta a "InnovaCorp" de forma positiva. Si el dueño del medio tiene acciones en la empresa o en el sector tecnológico, es improbable que se publiquen críticas profundas sobre los riesgos del plan. Los intereses económicos del propietario actúan como filtro invisible.'
    },
    '2': {
        title: '📺 Filtro 2: Publicidad',
        text:  '"InnovaCorp" es un gigante tecnológico y probablemente un gran anunciante. Un medio no arriesgaría millones en ingresos por publicidad publicando un reportaje crítico sobre los peligros de la vigilancia masiva. La dependencia publicitaria silencia las voces disidentes.'
    },
    '3': {
        title: '🎙️ Filtro 3: Fuentes',
        text:  'La noticia cita únicamente al CEO de la empresa y al gobierno —las fuentes de poder—. No se entrevista a expertos en privacidad, organizaciones de derechos humanos ni a ciudadanos que serán vigilados. La perspectiva queda sesgada desde el origen.'
    },
    '4': {
        title: '🔥 Filtro 4: Flak (Críticas)',
        text:  'Si un periodista publicara un artículo crítico, podría enfrentar una campaña de desprestigio de "grupos pro-seguridad", ser acusado de defender a los delincuentes o recibir presiones legales de InnovaCorp. El miedo al flak autoregula la cobertura.'
    },
    '5': {
        title: '👹 Filtro 5: Enemigo Común',
        text:  'El plan se justifica en la lucha contra "la delincuencia", un enemigo común que genera miedo y consenso. Cualquier oposición al plan de vigilancia queda automáticamente enmarcada como una defensa de los criminales, silenciando el debate sobre libertades civiles.'
    }
};

filterCards.forEach(card => {
    card.addEventListener('click', () => {
        const id = card.dataset.filter;
        modalTitle.textContent = filterData[id].title;
        modalText.textContent  = filterData[id].text;
        modal.classList.remove('hidden');
        card.classList.add('visited');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ══════════════════════════════════════ MÓDULO 3: QUIZ
const quizContainer    = document.getElementById('quiz-container');
const quizResults      = document.getElementById('quiz-results');
const quizProgressBar  = document.getElementById('quiz-progress-bar');
const progressFill     = document.getElementById('quiz-progress-fill');
const progressLabel    = document.getElementById('quiz-progress-label');
const scoreNum         = document.getElementById('score-num');
const scoreDenom       = document.getElementById('score-denom');
const quizScoreEl      = document.getElementById('quiz-score');
const quizFeedbackEl   = document.getElementById('quiz-feedback');
const scoreCircle      = document.getElementById('score-circle');
const retryBtn         = document.getElementById('quiz-retry-btn');

const questions = [
    {
        question: '¿Por qué los niños pueden crear oraciones que nunca antes han oído?',
        options: [
            'Porque imitan muy bien a sus padres.',
            'Porque nacen con una "Gramática Universal" innata.',
            'Porque estudian gramática en el colegio.',
            'Porque tienen mucha imaginación creativa.'
        ],
        answer: 1,
        explanation: 'Chomsky propuso que todos los humanos nacen con una capacidad lingüística innata: la Gramática Universal.'
    },
    {
        question: 'El "Modelo de Propaganda" sugiere que los medios de comunicación...',
        options: [
            'Son totalmente objetivos e independientes.',
            'Están controlados por una conspiración secreta orquestada.',
            'Sirven a los intereses de la élite a través de filtros estructurales.',
            'Solo publican noticias falsas deliberadamente.'
        ],
        answer: 2,
        explanation: 'El modelo no apela a conspiraciones, sino a filtros estructurales (propiedad, publicidad, fuentes, flak, enemigo común) que condicionan la cobertura de forma sistémica.'
    },
    {
        question: 'Que un medio dependa de anunciantes para financiarse corresponde al filtro de:',
        options: ['Propiedad', 'Publicidad', 'Fuentes oficiales', 'Flak'],
        answer: 1,
        explanation: 'El Filtro 2 (Publicidad) describe cómo la dependencia de los anunciantes disuade a los medios de publicar contenido que perjudique a sus clientes corporativos.'
    },
    {
        question: 'La "Estructura Profunda" en la teoría chomskiana se refiere a:',
        options: [
            'La pronunciación correcta de una oración.',
            'La gramática normativa de un idioma.',
            'El significado o idea central de una oración.',
            'El origen histórico de una palabra.'
        ],
        answer: 2,
        explanation: 'La estructura profunda es la representación abstracta del significado. La estructura superficial es la forma en que ese significado se expresa en palabras concretas.'
    }
];

const LETTERS = ['A', 'B', 'C', 'D'];
let currentQ = 0;
let score    = 0;

function updateProgress() {
    const pct = ((currentQ + 1) / questions.length) * 100;
    progressFill.style.width  = `${pct}%`;
    progressLabel.textContent = `Pregunta ${currentQ + 1} de ${questions.length}`;
}

function renderQuestion() {
    const q = questions[currentQ];
    updateProgress();

    quizContainer.innerHTML = `
        <div class="quiz-card">
            <p class="quiz-q-num">Pregunta ${currentQ + 1} / ${questions.length}</p>
            <p class="quiz-q-text">${q.question}</p>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <button class="quiz-opt" data-idx="${i}">
                        <span class="opt-letter">${LETTERS[i]}</span>
                        ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    quizContainer.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.idx)));
    });
}

function handleAnswer(chosen) {
    const q    = questions[currentQ];
    const opts = quizContainer.querySelectorAll('.quiz-opt');

    // Disable all buttons
    opts.forEach(btn => { btn.disabled = true; });

    // Mark correct/incorrect
    opts[q.answer].classList.add('correct');
    if (chosen !== q.answer) {
        opts[chosen].classList.add('incorrect');
    } else {
        score++;
    }

    // Advance after short delay
    setTimeout(() => {
        currentQ++;
        if (currentQ < questions.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }, 1100);
}

function showResults() {
    quizContainer.classList.add('hidden');
    quizProgressBar.classList.add('hidden');
    quizResults.classList.remove('hidden');

    scoreNum.textContent   = score;
    scoreDenom.textContent = `/${questions.length}`;
    quizScoreEl.textContent = `Obtuviste ${score} de ${questions.length} respuestas correctas.`;

    let feedback, circleColor;
    if (score === questions.length) {
        feedback     = '¡Excelente! Ya piensas como un analista chomskiano.';
        circleColor  = 'var(--green)';
    } else if (score >= Math.ceil(questions.length / 2)) {
        feedback     = '¡Buen trabajo! Has captado las ideas principales.';
        circleColor  = 'var(--blue)';
    } else {
        feedback     = '¡Sigue explorando! Repasa los módulos para afianzar los conceptos.';
        circleColor  = 'var(--red)';
    }

    quizFeedbackEl.textContent        = feedback;
    scoreCircle.style.borderColor     = circleColor;
    scoreCircle.style.color           = circleColor;
}

function initQuiz() {
    currentQ = 0;
    score    = 0;
    quizResults.classList.add('hidden');
    quizProgressBar.classList.remove('hidden');
    quizContainer.classList.remove('hidden');
    renderQuestion();
}

retryBtn.addEventListener('click', initQuiz);
initQuiz();
