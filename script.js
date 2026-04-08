// Récupération des valeurs
function getValue(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

function getVehicleData(prefix) {
  return {
    prix: getValue(`prix_${prefix}`) - getValue(`aide_${prefix}`),
    conso: getValue(`conso_${prefix}`),
    energie: getValue(`energie_${prefix}`),
    revision: getValue(`revision_${prefix}`),
    assurance: getValue(`assurance_${prefix}`)
  };
}

// Calcul du coût annuel
function calculCoutAnnuel(km, vehicule) {
  return (km / 100) * vehicule.conso * vehicule.energie
    + vehicule.revision
    + vehicule.assurance;
}

// Calcul total sur durée
function calculCouts(duree, km, vehicule) {
  let total = vehicule.prix;
  const resultats = [];

  for (let i = 1; i <= duree; i++) {
    total += calculCoutAnnuel(km, vehicule);
    resultats.push(total);
  }

  return resultats;
}

// Graphique
let chart;
function afficherGraphique(duree, elecData, thermData) {
  const ctx = document.getElementById('chart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: duree }, (_, i) => i + 1),
      datasets: [
        { label: 'Électrique (€)', data: elecData },
        { label: 'Thermique (€)', data: thermData }
      ]
    }
  });
}

// Fonction principale
function calculer() {
  const km = getValue('km');
  const duree = getValue('duree');

  const elec = getVehicleData('elec');
  const therm = getVehicleData('therm');

  const coutElec = calculCouts(duree, km, elec);
  const coutTherm = calculCouts(duree, km, therm);

  afficherGraphique(duree, coutElec, coutTherm);
}

// Event

document.getElementById('btnCalcul').addEventListener('click', calculer);
