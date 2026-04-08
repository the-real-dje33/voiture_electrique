function getValue(id) {
  return parseFloat(document.getElementById(id).value);
}

function validateInputs(ids) {
  for (let id of ids) {
    if (isNaN(getValue(id))) return false;
  }
  return true;
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

function calculCoutAnnuel(km, v) {
  return (km/100)*v.conso*v.energie + v.revision + v.assurance;
}
function calculCouts(duree, km, v) {
  let total = v.prix;
  let result = [];
  for(let i=1;i<=duree;i++){
    total += calculCoutAnnuel(km,v);
    result.push(total);
  }
  return result;
}

function findBreakEven(elec, therm) {
  for(let i=0;i<elec.length;i++){
    if(elec[i] < therm[i]) return i+1;
  }
  return null;
}

let chart;
function afficherGraphique(duree, elecData, thermData) {
  const ctx = document.getElementById('chart');
  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type:'line',
    data:{
      labels: Array.from({length:duree},(_,i)=>i+1),
      datasets:[
        {label:'Électrique (€)', data:elecData, tension:0.3},
        {label:'Thermique (€)', data:thermData, tension:0.3}
      ]
    },
    options:{
      animation:{ duration:1200 }
    }
  });
}
function afficherResultats(elec, therm, breakEven) {
  document.getElementById('result_elec').textContent = `Total électrique : ${Math.round(elec.at(-1))} €`;
  document.getElementById('result_therm').textContent = `Total thermique : ${Math.round(therm.at(-1))} €`;

  document.getElementById('rentabilite').textContent = breakEven
    ? `Rentable à partir de l'année ${breakEven}`
    : "Pas de rentabilité sur la période";
}

function calculer(){
  const ids = [
    'km','duree',
    'prix_elec','conso_elec','energie_elec','revision_elec','assurance_elec','aide_elec',
    'prix_therm','conso_therm','energie_therm','revision_therm','assurance_therm','aide_therm'
  ];

  if(!validateInputs(ids)){
    document.getElementById('error').textContent = "Merci de remplir tous les champs correctement";
    return;
  }
  document.getElementById('error').textContent = "";

  const km = getValue('km');
  const duree = getValue('duree');

  const elec = getVehicleData('elec');
  const therm = getVehicleData('therm');

  const coutElec = calculCouts(duree, km, elec);
  const coutTherm = calculCouts(duree, km, therm);

  const breakEven = findBreakEven(coutElec, coutTherm);

  afficherGraphique(duree, coutElec, coutTherm);
  afficherResultats(coutElec, coutTherm, breakEven);
}

document.getElementById('btnCalcul').addEventListener('click', calculer);
