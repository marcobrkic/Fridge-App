import Product from "./product.js";

/* 
    Diese Klasse repräsentiert die Datenstruktur des Kühlschranks.
    Sie sollte per Konstruktor eine Kapazität als Ganzzahl übergeben bekommen. 
    Sollte beim Versuch ein neues Produkt hinzuzufügen das maximal zugelassene Volumen überschritten werden,
    sollte das neue Produkt nicht hinzugefügt werden.
    Zur Vereinfachung ist das Volumen in der imaginären Einheit VU (Volume-Unit) zu behandeln.

    Desweiteren sollte die Klasse über einen Speicher für im Kühlschrank eingelagerte Produkte verfügen.

    Der Kühlschrank-Klasse müssen noch Instanz-Methoden beigefügt werden.
    Folgende Methoden sollten auf jeden Fall enthalten sein:
    - Eine Methode zur Ermittlung der freien Kapazität
    - Eine Methode zur Ermittlung der bereits verbrauchten Kapazität
    - Eine Methode zur Ermittlung der Anzahl eingelagerter Produkte
    - Eine Methode zur Ermittlung des Produktes mit dem kleinsten Volumen
    - Eine Methode zur Ermittlung des Produktes mit dem größten Volumen
    - Eine Methode zum Hinzufügen neuer Produkte
    - Eine Methode zum Entfernen vorhandener Produkte
    - Eine Methode zum Entfernen aller vorhandenen Produkte
    - Eine Methode zum Entfernen aller abgelaufenen Produkte
    - Eine Methode zum Sortieren der Produkte nach Ablaufdatum
*/
class Fridge {
    // Datenbank
    storage = [];

    constructor(capacity){
        // Kapazität
        this.capacity = capacity;
    }


    //-----------------------------------------------Methoden-------------------------------------------------

    // Freier Platz
    freeCapacity(){

        return this.capacity - this.usedCapacity();
    }
    // Benutzter Platz
    usedCapacity(){
        return this.storage.reduce((totalCapacity, product) => totalCapacity += product.volume, 0)
    }
    // Anzahl der Produkte
    totalProducts(){
        return this.storage.length;
    }
    // Produkt mit kleinstem Volumen

    smallestVU(){
        if (this.storage.length === 0) return '-'

        let smallestVolume = this.storage[0].volume;
          this.storage.forEach(product => {
            if (product.volume < smallestVolume) {
                smallestVolume = product.volume;
            }
          })
           return smallestVolume;
    }
    // Produkt  mit größtem Volumen
    biggestVU(){
        if (this.storage.length === 0) return '-'
        let biggestVolume = this.storage[0].volume;
          this.storage.forEach(product => {
            if (product.volume > biggestVolume) {
                biggestVolume = product.volume;
            }
          })
           return biggestVolume;
    }

    // Produkte zum Verbrauch bis morgen
    amountUntilTomorrow() {
        let amount = 0;

        this.storage.forEach(product => {
            let today = new Date();
            today.setHours(0,0,0,0);
            if (product.expirationDate - today === 0 ) {
                amount++;
            }
             
        })
        return amount;
    }

    // Anzahl der abgelaufenen Produkte
    amountExpiredProducts() {
        let amount = 0;

        this.storage.forEach(product => {
            let today = new Date();
            today.setHours(0,0,0,0);
            if (product.expirationDate < today ) {
                amount++;
            }
        })
        return amount;
    }

     // Produkte hinzuzufügen
     addProduct(product){
        if (this.capacity > product.volume) {
            this.storage.push(product);
        } else return `Not enougth capacity`;
    }

    // Produkte loeschen
    deleteProduct(productIndex){
        this.storage.splice(productIndex, 1);
    }

    // alle Produkte loeschen
    deleteAllProducts(){
        return this.storage.splice(0);
    }

    // abgelaufene Proukte loeschen
    deleteExpProducts(){
        let today = new Date();
        this.storage = this.storage.filter(produkt => produkt.expirationDate >= today);
    }

    // Produkte sortieren
    sortProducts(){
        this.storage.sort((a, b) => a.expirationDate - b.expirationDate);
    }

   
}


export default Fridge;