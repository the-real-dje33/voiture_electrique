const fields = [
  'km','duree',
  'prix_elec','conso_elec','energie_elec','revision_elec','assurance_elec','aide_elec',
  'prix_therm','conso_therm','energie_therm','revision_therm','assurance_therm','aide_therm'
];

function getValue(id){
  return parseFloat(document.getElementById(id).value);
}

function saveData(){
  const data = {};
  fields.forEach(id => data[id] = document.getElementById(id).value);
  localStorage.setItem('carComparator', JSON.stringify(data));
}

function loadData(){
  const data = JSON.parse(localStorage.getItem('carComparator'));
  if(!data) return;
  fields.forEach(id => {
    if(data[id]) document.getElementById(id).value = data[id];
  });
}

function resetData(){
  localStorage.removeItem('carComparator');
  fields.forEach(id => document.getElementById(id).value = '');
  location.reload();
}

function validateInputs(){
  return fields.every(id => !isNaN(getValue(id)));
}

function getVehicle(prefix){
  return {
    prix: getValue(`prix_${prefix}`) - getValue(`aide_${prefix}`),
    conso: getValue(`conso_${prefix}`),
    energie: getValue(`energie_${prefix}`),
    revision: getValue(`revision_${prefix}`),
    assurance: getValue(`assurance_${prefix}`)
  };
}

function annualCost(km,v){
  return (km/100)*v.conso*v.energie + v.revision + v.assurance;
}

function compute(duree,km,v){
  let total=v.prix;
  let arr=[];
  for(let i=1;i<=duree;i++){
    total+=annualCost(km,v);
    arr.push(total);
  }
  return arr;
}

function breakEven(e,t){
  for(let i=0;i<e.length;i++){
    if(e[i]<t[i]) return i+1;
  }
  return null;
}

let chart;
function draw(duree,e,t){
  const ctx=document.getElementById('chart');
  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:'line',
    data:{
      labels:Array.from({length:duree},(_,i)=>`Année ${i+1}`),
      datasets:[
        {label:'Électrique',data:e,tension:0.4},
        {label:'Thermique',data:t,tension:0.4}
      ]
    },
    options:{animation:{duration:1200}}
  });
}

function showResults(e,t,be){
  result_elec.textContent=`Total électrique : ${Math.round(e.at(-1))} €`;
  result_therm.textContent=`Total thermique : ${Math.round(t.at(-1))} €`;
  rentabilite.textContent=be?`Rentable année ${be}`:"Non rentable";
}

function calculer(){
  if(!validateInputs()){
    error.textContent="Remplis correctement tous les champs";
    return;
  }

  error.textContent="";

  const km=getValue('km');
  const duree=getValue('duree');

  const e=getVehicle('elec');
  const t=getVehicle('therm');

  const ce=compute(duree,km,e);
  const ct=compute(duree,km,t);

  draw(duree,ce,ct);
  showResults(ce,ct,breakEven(ce,ct));

  saveData();
}

btnCalcul.addEventListener('click',calculer);
btnReset.addEventListener('click',resetData);

loadData();
