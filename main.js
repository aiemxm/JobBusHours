require("dotenv").config();

const apiKey = process.env.API_KEY;
let nextBusObject = {
  hour: "",
  line: "",
};
let hoursArray = [];

const getNextBusHours = async () => {
  try {
    const response = await fetch(
      `http://api.tisseo.fr/v2/stops_schedules.json?key=${apiKey}&number=5&stopAreaId=stop_area:SA_1312&dateTime=2023-03-11+17:45`
    );
    const data = await response.json();

    let departures = await data.departures.departure;
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
  } catch (error) {
    console.log("error" + error);
  }
  const nextBus = Math.floor((hoursArray[0].hour - Date.now()) / 60000);
  const secondBus = Math.floor((hoursArray[1].hour - Date.now()) / 60000);

  const result = `Prochains bus destination Basso Cambo :
      ${hoursArray[0].line} : ${nextBus} mn
      ${hoursArray[1].line} : ${secondBus} mn`;
  console.log(
    `Prochains bus destination Basso Cambo :
        ${hoursArray[0].line} : ${nextBus} mn
        ${hoursArray[1].line} : ${secondBus} mn`
  );

  return result;
};

// définir l'heure à laquelle vous souhaitez exécuter la fonction
const heureExecution = { heures: 17, minutes: 55, secondes: 0 };

// fonction pour calculer le temps restant jusqu'à l'heure d'exécution
function tempsRestant() {
  const maintenant = new Date();
  const heureActuelle = maintenant.getHours();
  const minuteActuelle = maintenant.getMinutes();
  const secondeActuelle = maintenant.getSeconds();

  let tempsEnMs = 0;

  if (
    heureActuelle < heureExecution.heures ||
    (heureActuelle === heureExecution.heures &&
      minuteActuelle < heureExecution.minutes) ||
    (heureActuelle === heureExecution.heures &&
      minuteActuelle === heureExecution.minutes &&
      secondeActuelle < heureExecution.secondes)
  ) {
    tempsEnMs =
      (heureExecution.heures - heureActuelle) * 3600 * 1000 +
      (heureExecution.minutes - minuteActuelle) * 60 * 1000 +
      (heureExecution.secondes - secondeActuelle) * 1000;
  } else {
    tempsEnMs =
      (24 - heureActuelle + heureExecution.heures) * 3600 * 1000 +
      (heureExecution.minutes - minuteActuelle) * 60 * 1000 +
      (heureExecution.secondes - secondeActuelle) * 1000;
  }

  return tempsEnMs;
}
getNextBusHours();
// fonction pour exécuter la fonction et planifier la prochaine exécution
function executerEtPlanifier() {
  // calculer le temps restant jusqu'à l'heure d'exécution suivante
  const tempsEnMs = tempsRestant();

  // planifier la prochaine exécution
  setTimeout(executerEtPlanifier, tempsEnMs);
}

// planifier la première exécution
const tempsEnMs = tempsRestant();
setTimeout(executerEtPlanifier, tempsEnMs);
