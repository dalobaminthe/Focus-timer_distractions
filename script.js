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

// Pour tester l'étape 1 : le timer démarre automatiquement au chargement
mettreAJourAffichage();
demarrerMinuteur();
