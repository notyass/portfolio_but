// ==================== VARIABLES GLOBALES ====================
// Cette variable stocke la langue actuelle (non utilisée car traduction supprimée)
let currentLang = 'fr';

// ==================== ANIMATION SAKURA (PÉTALES DE CERISIER) ====================
/**
 * FONCTION : initSakura()
 * RÔLE : Crée et anime les pétales de cerisier qui tombent en arrière-plan
 * COMMENT : Utilise un canvas HTML5 pour dessiner et animer 50 pétales roses
 */
function initSakura() {
    const canvas = document.getElementById('sakuraCanvas');
    const ctx = canvas.getContext('2d');
    
    // Définir la taille du canvas = taille de la fenêtre
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const petals = [];
    const petalCount = 50; // Nombre de pétales à l'écran
    
    // Classe pour créer un pétale avec ses propriétés
    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;  // Position X aléatoire
            this.y = Math.random() * canvas.height - canvas.height;  // Commence au-dessus
            this.size = Math.random() * 5 + 3;  // Taille entre 3 et 8
            this.speed = Math.random() * 1 + 0.5;  // Vitesse de chute
            this.opacity = Math.random() * 0.5 + 0.3;  // Transparence
            this.swing = Math.random() * 2 - 1;  // Mouvement de balancement
            this.swingSpeed = Math.random() * 0.03 + 0.01;  // Vitesse du balancement
            this.rotation = Math.random() * 360;  // Angle de rotation initial
            this.rotationSpeed = Math.random() * 2 - 1;  // Vitesse de rotation
        }
        
        // Met à jour la position du pétale à chaque frame
        update() {
            this.y += this.speed;  // Descend
            this.x += Math.sin(this.y * this.swingSpeed) * this.swing;  // Balancement
            this.rotation += this.rotationSpeed;  // Tourne
            
            // Si le pétale sort de l'écran en bas, il réapparaît en haut
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            
            // Gère les bords gauche/droite
            if (this.x > canvas.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = canvas.width;
            }
        }
        
        // Dessine le pétale sur le canvas
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            
            // Forme elliptique pour ressembler à un pétale
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#ffc0cb';
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    // Créer 50 pétales
    for (let i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }
    
    // Boucle d'animation qui tourne en continu
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Efface le canvas
        
        // Met à jour et dessine chaque pétale
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        
        requestAnimationFrame(animate);  // Rappelle la fonction (60fps)
    }
    
    animate();  // Lance l'animation
    
    // Redimensionne le canvas si la fenêtre change de taille
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==================== NAVIGATION ====================
/**
 * FONCTION : initNavigation()
 * RÔLE : Gère le menu de navigation (mobile + scroll)
 * COMMENT : Menu hamburger, fermeture au clic, effet au scroll, liens actifs
 */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // HAMBURGER : Toggle menu mobile (ouvre/ferme)
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // FERMETURE : Ferme le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // EFFET SCROLL : Change l'apparence de la navbar au scroll
    window.addEventListener('scroll', () => {
        // Ajoute une ombre quand on scrolle > 100px
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // LIEN ACTIF : Surligne le lien correspondant à la section visible
        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // SMOOTH SCROLL : Défilement fluide vers les sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,  // -80 pour éviter la navbar
                behavior: 'smooth'
            });
        });
    });
}

// ==================== ANIMATION DES COMPÉTENCES ====================
/**
 * FONCTION : initSkillsAnimation()
 * RÔLE : Anime les barres de progression des compétences
 * COMMENT : Utilise IntersectionObserver pour détecter quand la section est visible
 */
function initSkillsAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const observerOptions = {
        threshold: 0.5,  // Déclenche quand 50% de l'élément est visible
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Récupère la valeur de progression (ex: 85%)
                const progressBar = entry.target.querySelector('.skill-progress');
                const progress = progressBar.getAttribute('data-progress');
                
                // Anime la barre après un petit délai
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 200);
                
                observer.unobserve(entry.target);  // Ne l'anime qu'une fois
            }
        });
    }, observerOptions);
    
    // Observe chaque carte de compétence
    skillCards.forEach(card => {
        observer.observe(card);
    });
}

// ==================== ANIMATION AU SCROLL ====================
/**
 * FONCTION : initScrollAnimations()
 * RÔLE : Fait apparaître les éléments en fondu quand on scrolle
 * COMMENT : Rend visible les cartes/timeline progressivement
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .skill-card');
    
    const observerOptions = {
        threshold: 0.1,  // Déclenche dès que 10% est visible
        rootMargin: '0px 0px -100px 0px'  // Avec une marge en bas
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Anime avec un délai progressif (effet cascade)
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Initialise les éléments comme invisibles, puis les observe
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

// ==================== COMPTEUR STATISTIQUES ====================
/**
 * FONCTION : initStatsCounter()
 * RÔLE : Anime les chiffres des statistiques (2+, 15+, 4)
 * COMMENT : Compte progressivement de 0 jusqu'au chiffre final
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5  // Quand 50% est visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;  // Ex: "2+"
                const numericValue = parseInt(finalValue.match(/\d+/)[0]);  // Extrait "2"
                const suffix = finalValue.replace(numericValue, '');  // Extrait "+"
                
                let current = 0;
                const increment = numericValue / 50;  // Divise en 50 étapes
                const duration = 2000;  // 2 secondes
                const stepTime = duration / 50;
                
                // Compte progressivement
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        target.textContent = numericValue + suffix;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(current) + suffix;
                    }
                }, stepTime);
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// ==================== PARALLAX EFFECT ====================
/**
 * FONCTION : initParallax()
 * RÔLE : Crée un effet de profondeur sur la page d'accueil
 * COMMENT : Les éléments bougent à des vitesses différentes au scroll
 */
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-content, .image-frame');
        
        // Chaque élément bouge à une vitesse différente
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('hero-content') ? 0.5 : 0.3;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ==================== CURSEUR PERSONNALISÉ====================
/**
 * FONCTION : initCustomCursor()
 * RÔLE : Remplace le curseur par défaut par un curseur personnalisé rose
 * COMMENT : Crée 2 cercles (petit et grand) qui suivent la souris
 * NOTE : Uniquement sur desktop (désactivé sur mobile)
 */
function initCustomCursor() {
    // Crée le petit point rose
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Crée le cercle qui suit
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'custom-cursor-follower';
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    // Met à jour la position du petit curseur instantanément
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Anime le cercle suiveur avec un effet de retard (easing)
    function animateFollower() {
        const distX = mouseX - followerX;
        const distY = mouseY - followerY;
        
        followerX += distX * 0.1;  // Suit avec 10% de la distance
        followerY += distY * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // EFFET HOVER : Agrandit le curseur sur les éléments cliquables
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
    
    // Ajoute les styles CSS pour le curseur personnalisé
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor, .custom-cursor-follower {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
        }
        
        .custom-cursor {
            width: 10px;
            height: 10px;
            background: var(--primary-color);
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        }
        
        .custom-cursor-follower {
            width: 30px;
            height: 30px;
            border: 2px solid var(--primary-color);
            transform: translate(-50%, -50%);
            transition: transform 0.15s ease;
        }
        
        @media (max-width: 1024px) {
            .custom-cursor, .custom-cursor-follower {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== EFFET TYPING POUR LE TITRE ====================
/**
 * FONCTION : initTypingEffect()
 * RÔLE : Anime le nom comme si on le tapait au clavier
 * COMMENT : Affiche lettre par lettre avec un délai
 */
function initTypingEffect() {
    const nameElement = document.querySelector('.name');
    const originalText = nameElement.textContent;
    nameElement.textContent = '';  // Vide le texte
    
    let index = 0;
    const typingSpeed = 100;  // 100ms entre chaque lettre
    
    // Fonction qui ajoute une lettre à la fois
    function type() {
        if (index < originalText.length) {
            nameElement.textContent += originalText.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        } else {
            // Après le typing, ajoute un effet glitch automatique
            setTimeout(() => {
                nameElement.classList.add('auto-glitch');
                setTimeout(() => {
                    nameElement.classList.remove('auto-glitch');
                }, 600);
            }, 1000);
        }
    }
    
    setTimeout(type, 500);  // Commence après 0.5s
}

// ==================== EFFET GLITCH AUTOMATIQUE ====================
/**
 * FONCTION : initAutoGlitch()
 * RÔLE : Fait "bugger" le nom toutes les 5 secondes (effet cyberpunk)
 * COMMENT : Ajoute/retire la classe 'auto-glitch' en boucle
 */
function initAutoGlitch() {
    const nameElement = document.querySelector('.name');
    
    // Ajoute les styles pour l'animation auto
    const style = document.createElement('style');
    style.textContent = `
        .name.auto-glitch {
            animation: glitchText 0.6s ease-in-out;
        }
        .name.auto-glitch::before {
            animation: glitch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
            color: #ff69b4;
            z-index: -1;
            opacity: 0.8;
        }
        .name.auto-glitch::after {
            animation: glitch 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
            color: #ffd700;
            z-index: -2;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    // Glitch automatique toutes les 5 secondes
    setInterval(() => {
        nameElement.classList.add('auto-glitch');
        setTimeout(() => {
            nameElement.classList.remove('auto-glitch');
        }, 600);
    }, 5000);
}

// ==================== GESTION DU LOGO ====================
/**
 * FONCTION : initLogoChange()
 * RÔLE : Cache le logo si l'image n'existe pas
 * COMMENT : Écoute l'événement 'error' de l'image
 */
function initLogoChange() {
    const logoImg = document.getElementById('logoImg');
    
    // Si l'image ne charge pas, on la cache
    logoImg.addEventListener('error', function() {
        this.style.display = 'none';
    });
}

// ==================== TÉLÉCHARGEMENT CV ====================
/**
 * FONCTION : initDownloadCV()
 * RÔLE : Affiche un message quand on clique sur "Télécharger CV"
 * COMMENT : Crée une notification temporaire en haut de l'écran
 */
function initDownloadCV() {
    const downloadBtns = document.querySelectorAll('.download-btn, .btn-download');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Animation du bouton (effet de clic)
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
            
            // Crée un message de notification
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideDown 0.5s ease-out;
            `;
            message.textContent = 'CV prêt à être téléchargé! Ajoutez votre fichier CV.pdf dans le dossier.';
            
            document.body.appendChild(message);
            
            // Supprime le message après 3 secondes
            setTimeout(() => {
                message.style.animation = 'slideUp 0.5s ease-out';
                setTimeout(() => {
                    document.body.removeChild(message);
                }, 500);
            }, 3000);
            
            // Ajoute les animations CSS si pas déjà présentes
            if (!document.getElementById('downloadAnimation')) {
                const style = document.createElement('style');
                style.id = 'downloadAnimation';
                style.textContent = `
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateX(-50%) translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(-50%) translateY(0);
                        }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 1;
                            transform: translateX(-50%) translateY(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(-50%) translateY(-20px);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    });
}

// ==================== EFFET HOVER 3D SUR LES CARTES ====================
/**
 * FONCTION : init3DCardEffect()
 * RÔLE : Fait pivoter les cartes en 3D quand on passe la souris dessus
 * COMMENT : Calcule la position de la souris et applique une rotation perspective
 */
function init3DCardEffect() {
    const cards = document.querySelectorAll('.skill-card, .project-card, .timeline-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;  // Position X dans la carte
            const y = e.clientY - rect.top;   // Position Y dans la carte
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calcule l'angle de rotation (max 10deg)
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        // Remet la carte à plat quand la souris part
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ==================== CHARGEMENT DES IMAGES ====================
/**
 * FONCTION : initImageLoading()
 * RÔLE : Remplace les images manquantes par des placeholders
 * COMMENT : Détecte les erreurs de chargement et crée un div gris
 */
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Si l'image ne charge pas, crée un placeholder
        img.addEventListener('error', function() {
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 1rem;
                text-align: center;
                padding: 1rem;
            `;
            placeholder.textContent = this.alt || 'Image à ajouter';
            
            if (this.parentElement) {
                this.parentElement.style.position = 'relative';
                this.style.display = 'none';
                this.parentElement.insertBefore(placeholder, this);
            }
        });
    });
}

// ==================== INITIALISATION ====================
/**
 * FONCTION PRINCIPALE : Lance tout quand la page est chargée
 * RÔLE : Initialise toutes les fonctionnalités du portfolio
 */
document.addEventListener('DOMContentLoaded', () => {
    // Lance toutes les fonctions d'initialisation
    initSakura();              // Pétales de cerisier animés
    initNavigation();          // Menu de navigation
    initSkillsAnimation();     // Barres de progression des compétences
    initScrollAnimations();    // Apparition des éléments au scroll
    initStatsCounter();        // Compteur des statistiques
    initParallax();            // Effet parallax sur le hero
    initCustomCursor();        // Curseur personnalisé rose
    initTypingEffect();        // Animation typing du nom
    initAutoGlitch();          // Effet glitch automatique
    initLogoChange();          // Gestion du logo
    initDownloadCV();          // Bouton télécharger CV
    init3DCardEffect();        // Effet 3D sur les cartes
    initImageLoading();        // Gestion des images manquantes
    
    // Ajoute une classe pour indiquer que le JS est chargé
    document.body.classList.add('js-loaded');
    
    // Animation de fade-in au chargement de la page
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Message de bienvenue stylisé dans la console (F12)
    console.log('%c🌸 Portfolio Japonais 🌸', 'color: #ff69b4; font-size: 24px; font-weight: bold;');
    console.log('%cDéveloppé avec passion et attention aux détails', 'color: #666; font-size: 14px;');
    console.log('%c侍 - Le chemin du développeur', 'color: #ffd700; font-size: 16px; font-weight: bold;');
});

// ==================== GESTION DES ERREURS ====================
/**
 * Capture les erreurs JavaScript et les affiche dans la console
 */
window.addEventListener('error', (e) => {
    console.error('Une erreur est survenue:', e.error);
});

// ==================== OPTIMISATION PERFORMANCE ====================
/**
 * Précharge les images en arrière-plan quand le navigateur est inactif
 * Améliore la vitesse de chargement des pages suivantes
 */
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Liste des images à précharger
        const imageUrls = [
            'css/images/profile.png',
            'css/images/project1.png',
            'css/images/project2.png',
            'css/images/project3.png',
            'css/images/project4.png',
            'css/images/project5.jpg',
            'css/images/project6.jpg'
        ];
        
        // Précharge chaque image
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    });
}