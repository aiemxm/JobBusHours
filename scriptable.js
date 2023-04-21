// Script for the Scriptable iOS Application

// Récupération de la clé API depuis les environnements Scriptable
const apiKey = "46cb1cc7-907c-4d9a-a39a-00f4be153433";
let url =
  "http://api.tisseo.fr/v2/stops_schedules.json?key=${apiKey}&number=5&stopAreaId=stop_area:SA_1312&dateTime=now";
// Définition de l'objet pour stocker les horaires des prochains bus
let nextBusObject = {
  hour: "",
  line: "",
};

// Tableau pour stocker les horaires des prochains bus
let hoursArray = [];

// Appel à l'API Tisseo pour récupérer les horaires
let req = new Request(url);
let response = await req.json();

let departures = data.departures.departure;
departures.forEach((departure) => {
  departure.destination.forEach((terminus) => {
    if (terminus.name === "Basso Cambo") {
      let bus = Object.create(nextBusObject);
      bus.hour = Date.parse(departure.dateTime);
      bus.line = departure.line.shortName;
      hoursArray.push(bus);
    }
  });
});
// Calcul des minutes avant l'arrivée des deux prochains bus
const nextBus = Math.floor((hoursArray[0].hour - Date.now()) / 60000);
const secondBus = Math.floor((hoursArray[1].hour - Date.now()) / 60000);

const result = `Prochains bus destination Basso Cambo :
        ${hoursArray[0].line} : ${nextBus} mn
        ${hoursArray[1].line} : ${secondBus} mn`;

