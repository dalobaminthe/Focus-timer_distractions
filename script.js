// -- FOND ANIMÉ --
function genererParticules() {
  const conteneurFond = document.getElementById('fondAnime');
  const nombreDeParticules = 25;

  for (let i = 0; i < nombreDeParticules; i++) {
    const particule = document.createElement('div');
    particule.classList.add('particule');

    const taille = Math.random() * 6 + 3;
    const positionGauche = Math.random() * 100;
    const duree = Math.random() * 15 + 10; 
    const delai = Math.random() * 20;
    const deriveX = (Math.random() * 80 - 40) + 'px';

    particule.style.width = `${taille}px`;
    particule.style.height = `${taille}px`;
    particule.style.left = `${positionGauche}%`;
    particule.style.animationDuration = `${duree}s`;
    particule.style.animationDelay = `${delai}s`;
    particule.style.setProperty('--deriveX', deriveX);

    conteneurFond.appendChild(particule);
  }
}

genererParticules();

// -- TIMER DE DÉCOMPTE --

let secondesRestantes = 25 * 60; // 25 minutes en secondes
let minuteurEnCours = null;

const elementMinutes = document.getElementById('minutes');
const elementSecondes = document.getElementById('secondes');
const elementEtatSession = document.getElementById('etatSession');

function formaterTemps(valeur) {
  return valeur.toString().padStart(2, '0');
}

function mettreAJourAffichage() {
  const minutes = Math.floor(secondesRestantes / 60);
  const secondes = secondesRestantes % 60;

  elementMinutes.textContent = formaterTemps(minutes);
  elementSecondes.textContent = formaterTemps(secondes);
}

function demarrerMinuteur() {
  elementEtatSession.textContent = 'Session de focus en cours...';

  minuteurEnCours = setInterval(() => {
    if (secondesRestantes > 0) {
      secondesRestantes--;
      mettreAJourAffichage();
    } else {
      clearInterval(minuteurEnCours);
      elementEtatSession.textContent = 'Session terminée !';
    }
  }, 1000);
}

mettreAJourAffichage();
demarrerMinuteur();