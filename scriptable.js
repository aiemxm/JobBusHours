// Script for the Scriptable iOS Application

// Récupération de la clé API depuis les environnements Scriptable
const apiKey = Keychain.get("tisseo-api-key");

// Définition de l'objet pour stocker les horaires des prochains bus
let nextBusObject = {
  hour: "",
  line: "",
};

// Tableau pour stocker les horaires des prochains bus
let hoursArray = [];

// Fonction pour récupérer les horaires des prochains bus en direction de Basso Cambo
const getNextBusHours = async () => {
  // Appel à l'API Tisseo pour récupérer les horaires
  await fetch(
    `http://api.tisseo.fr/v2/stops_schedules.json?key=${apiKey}&number=5&stopAreaId=stop_area:SA_1312&dateTime=now`
  )
    .then((response) => response.json())
    .then((data) => {
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

      // Programmation de la notification pour 17h55
      let notification = new Notification();
      notification.title = "Prochains bus Tisséo";
      notification.body = result;
      let date = new Date();
      date.setHours(17);
      date.setMinutes(55);
      date.setSeconds(0);
      notification.schedule = date;
    });
};

// Exécution de la fonction pour récupérer les horaires des prochains bus
getNextBusHours();
