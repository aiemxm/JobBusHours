let now = Date.now();
let horaires = [];
let busLines = [];
const getNextBusHours = async () => {
  await fetch(
    "http://api.tisseo.fr/v2/stops_schedules.json?key=46cb1cc7-907c-4d9a-a39a-00f4be153433&number=5&stopAreaId=stop_area:SA_1312&dateTime=2023-03-11+17:45"
  )
    .then((response) => response.json())
    .then((data) => {
      let departures = data.departures.departure;
      departures.forEach((departure) => {
        departure.destination.forEach((terminus) => {
          if (terminus.name === "Basso Cambo") {
            horaires.push(Date.parse(departure.dateTime));
            busLines.push(departure.line.shortName);
          }
        });
      });
      const nextBus = Math.floor((horaires[0] - now) / 60000);
      const secondBus = Math.floor((horaires[1] - now) / 60000);

      console.log(
        `le prochain bus ${busLines[0]} à destination de Basso Cambo passe dans ${nextBus} minutes, le suivant est un ${busLines[1]} et passe dans ${secondBus} minutes`
      );
    });
};

getNextBusHours();
