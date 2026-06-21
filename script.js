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

const DUREE_FOCUS = 25 * 60;
const DUREE_PAUSE = 5 * 60; 

let secondesRestantes = DUREE_FOCUS;
let minuteurEnCours = null;
let estEnPause = false;
let timerActif = false;

const elementMinutes = document.getElementById('minutes');
const elementSecondes = document.getElementById('secondes');
const elementEtatSession = document.getElementById('etatSession');
const boutonDemarrer = document.getElementById('boutonDemarrer');
const boutonPause = document.getElementById('boutonPause');
const boutonReinitialiser = document.getElementById('boutonReinitialiser');

function formaterTemps(valeur) {
  return valeur.toString().padStart(2, '0');
}

function mettreAJourAffichage() {
  const minutes = Math.floor(secondesRestantes / 60);
  const secondes = secondesRestantes % 60;

  elementMinutes.textContent = formaterTemps(minutes);
  elementSecondes.textContent = formaterTemps(secondes);
}

function mettreAJourMessageEtat() {
  if (estEnPause) {
    elementEtatSession.textContent = 'Pause en cours...';
  } else {
    elementEtatSession.textContent = 'Session de focus en cours...';
  }
}

function basculerSession() {
  estEnPause = !estEnPause;
  secondesRestantes = estEnPause ? DUREE_PAUSE : DUREE_FOCUS;
  mettreAJourAffichage();
  mettreAJourMessageEtat();
}

function lancerDecompte() {
  minuteurEnCours = setInterval(() => {
    if (secondesRestantes > 0) {
      secondesRestantes--;
      mettreAJourAffichage();
    } else {
      basculerSession();
    }
  }, 1000);
}

function demarrerMinuteur() {
  if (timerActif) return;
  timerActif = true;
  mettreAJourMessageEtat();
  lancerDecompte();

  boutonDemarrer.disabled = true;
  boutonPause.disabled = false;
}

function mettreEnPauseMinuteur() {
  timerActif = false;
  clearInterval(minuteurEnCours);
  elementEtatSession.textContent = 'En pause';

  boutonDemarrer.disabled = false;
  boutonPause.disabled = true;
}

function reinitialiserMinuteur() {
  timerActif = false;
  estEnPause = false;
  clearInterval(minuteurEnCours);

  secondesRestantes = DUREE_FOCUS;
  mettreAJourAffichage();
  elementEtatSession.textContent = 'Prêt à démarrer';

  boutonDemarrer.disabled = false;
  boutonPause.disabled = true;
}

boutonDemarrer.addEventListener('click', demarrerMinuteur);
boutonPause.addEventListener('click', mettreEnPauseMinuteur);
boutonReinitialiser.addEventListener('click', reinitialiserMinuteur);

mettreAJourAffichage();

// -- DÉTECTION DES INTERRUPTIONS --

let journalDistractions = chargerJournal(); // récupère l'historique déjà sauvegardé

function chargerJournal() {
  const donneesSauvegardees = localStorage.getItem('journalDistractions');
  return donneesSauvegardees ? JSON.parse(donneesSauvegardees) : [];
}

function sauvegarderJournal() {
  localStorage.setItem('journalDistractions', JSON.stringify(journalDistractions));
}

const elementModaleDistraction = document.getElementById('modaleDistraction');
const boutonsRaison = document.querySelectorAll('.boutonRaison');

function gererChangementVisibilite() {
  if (!timerActif || estEnPause) return;

  if (document.hidden) {
    // L'utilisateur quitte l'onglet
    momentDeSortie = Date.now();
  } else if (momentDeSortie) {
    // L'utilisateur revient sur l'onglet
    const dureeAbsence = Math.round((Date.now() - momentDeSortie) / 1000);

    if (dureeAbsence >= 5) {
      afficherModaleDistraction(dureeAbsence);
    }

    momentDeSortie = null;
  }
}

function afficherModaleDistraction(dureeAbsence) {
  elementModaleDistraction.dataset.duree = dureeAbsence;
  elementModaleDistraction.hidden = false;
}

function enregistrerDistraction(raison) {
  const duree = parseInt(elementModaleDistraction.dataset.duree, 10);

  journalDistractions.push({
    raison: raison,
    dureeSecondes: duree,
    horodatage: new Date().toISOString()
  });

  sauvegarderJournal();

  console.log('Distraction enregistrée :', journalDistractions);

  elementModaleDistraction.hidden = true;
}

boutonsRaison.forEach((bouton) => {
  bouton.addEventListener('click', () => {
    enregistrerDistraction(bouton.dataset.raison);
  });
});

document.addEventListener('visibilitychange', gererChangementVisibilite);