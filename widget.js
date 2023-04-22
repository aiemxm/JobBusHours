// Crée un widget de taille moyenne
let widget = new ListWidget();
widget.backgroundColor = new Color("#222");

// Ajoute une vue web pour afficher la carte OpenStreetMap
let webView = new WebView();
await webView.loadURL(
  "https://www.openstreetmap.org/export/embed.html?bbox=2.32,48.83,2.38,48.87&layer=mapnik"
);
await webView.present();

// Affiche le widget
Script.setWidget(widget);
Script.complete();
