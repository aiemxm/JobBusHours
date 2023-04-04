require("dotenv").config();

const apiKey = process.env.API_KEY;
let nextBusObject = {
  hour: "",
  line: "",
};
let hoursArray = [];

const getNextBusHours = async () => {
  await fetch(
    `http://api.tisseo.fr/v2/stops_schedules.json?key=${apiKey}&number=5&stopAreaId=stop_area:SA_1312&dateTime=2023-03-11+17:45`
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
      const nextBus = Math.floor((hoursArray[0].hour - Date.now()) / 60000);
      const secondBus = Math.floor((hoursArray[1].hour - Date.now()) / 60000);

      console.log(
        `le prochain bus ${hoursArray[0].line} à destination de Basso Cambo passe dans ${nextBus} minutes, le suivant est un ${hoursArray[1].line} et passe dans ${secondBus} minutes`
      );
    });
};

getNextBusHours();
