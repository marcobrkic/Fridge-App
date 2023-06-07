/* 
    Dies ist die haupt Javascript Datei, die im HTML eingebunden ist.
    Hierin sollten alle Nutzer-Interaktionen geregelt werden.

    Hierin sollten möglichst keine Datenstrukturdaten gespeichert werden, 
    dafür sind die beiden Klassen 'Fridge' und 'Product' vorgesehen.
    Die nötigen Dateien für die Fridge- und Productklasse sind bereits eingebunden,
    so dass von hier aus von ihnen Gebrauch gemacht werden kann.

    Es empfiehlt sich das Befüllen bzw. Erzeugen der dynamischen GUI Elemente
    in einer größeren Methode zu definieren, die sich an den in der Datenstruktur hinterlegten Daten orientiert.
    So kann man diese Methode bei jeder Änderung der Daten immer wieder aufrufen 
    und muss sich nicht um das Hinzufügen, Ändern oder Entfernen einzelner HTML-Elemente kümmern.

    Die Datei enthält bereits eine Methode zum Erzeugen von Product-Cards.
    Sie liefert das fertige und mit Daten befüllte HTML-Element zurück.

    Außerdem hat Datei einige nötige Referenzen auf HTML-Elemente der GUI.
    Diese können bereits genutzt werden.
    Weitere nötige Referenzen auf HTML-Elemente der GUI können nach demselben Muster per ID-Zugriff gemacht werden.
*/

// Imports der Kühlschrank Klasse aus der externen Datei
import Fridge from "./fridge.js";
// Imports der Produkt Klasse aus der externen Datei
import Product from "./product.js";

/* ----------- HILFSVARIABLEN ----------- */
// Konstante für einen Tag in Millisekunden
const ONE_DAY = 1000 * 60 * 60 * 24;
/* -------------------------------------- */

/* ----------- GUI REFERENZEN ----------- */

// Referenz auf Produkte-Container
const fridgeProductsContainer = document.querySelector('#fridge-products-container');

// Referenz auf Input für Name des neuen Produkts
const addProductNameInput = document.querySelector('#form-add-product-name');
// Referenz auf Input für Volumen des neuen Produkts
const addProductVolInput = document.querySelector('#form-add-product-volume');
// Referenz auf Input für Ablaufdatum des neuen Produkts
const addProductExpDateInput = document.querySelector('#form-add-product-exp-date');
// Referenz auf Button für Bestätigung des neuen Produkts
const addProductSubmitBtn = document.querySelector('#btn-add-product');
// Referenz auf die fridge kapazität insgesamt
const fridgeCapacitySpan = document.querySelector("#fridge-capacity-span");
// Referenz auf die produktanzahl im fridge
const amountProductsSpan = document.querySelector("#products-amount-span");
// Referenz auf freie kapazität im fridge
const freeCapacitySpan = document.querySelector('#fridge-free-capacity-span');
// Referenz auf produkte zum verbrauch bis morgen
const untilTomorrowSpan = document.querySelector('#products-until-tomorrow-span');
// Referenz fuer abgelaufene Produkte
const expiredProductsSpan = document.querySelector('#products-expired-span');
// Referenz fuer kleinstes Produktvolumen
const smallestProductSpan = document.querySelector('#smallest-product-span');
// Referenz fuer groesstes Produktvolumen
const biggestProductSpan = document.querySelector('#biggest-product-span');
// Referenz  auf Button zum Loeschen aller  abgelaufenen Produkte
const cleanFridgeButton = document.querySelector('#clean-fridge-btn');
// Referenz  auf Button zum Sortieren der Produkte nach Ablaufdatum
const sortProductsButton = document.querySelector('#sort-products-by-exp-date-btn');
// Referenz  auf Button zum Loeschen aller Produkte
const removeAllProductsButton = document.querySelector('#remove-all-products-btn');



/* -------------------------------------- */


/* 
    Funktion zum Erstellen einer Produktcard für den Kühlschrank.
    Sie erhält als Parameter
    - Den Namen des Produkts (productName)
    - Das Volumen des Produkts (productVolume), also den Platz, den es innerhalb des Kühlschranks einnimmt
    - Das Ablaufdatum des Produkts (productExpDate)
    - Ein boole'scher Indikator dafür, ob das Produkt abgelaufen ist (isExpired)
    - Eine Callback-Funktion für Behandlung des Klicks auf den Löschknopf der jeweiligen Card (deleteCallback)
        Sollte dieses Callback keiner Funktion entsprechen (oder nicht mitgeliefert werden) erscheint eine Fehlermeldung in der Konsole.

    Als Rückgabewert (return) liefert sie das fertige HTML-Element mit allen übergebenen Informationen.
*/
function createNewProductCard(productName, productVolume, productExpDate, isExpired, deleteCallback) {
    // Erstelle äußeres Card-div
    let card = document.createElement('div');
    // Hänge Bootstrap card-Klasse an
    card.classList.add('card');


    // Erstelle inneres Card-Body-div
    let cardBody = document.createElement('div');
    // Hänge Bootstrap card-body-Klasse an
    cardBody.classList.add('card-body');


    // Erstelle Card Titel
    let cardTitle = document.createElement('h5');
    // Hänge Bootstrap card-title Klasse an
    cardTitle.classList.add('card-title');
    // Fülle Card Titel mit übergebenem Produktnamen
    cardTitle.innerText = productName + ' ';

    // Erstelle Knopf zum Löschen des Produktes
    let deleteCardBtn = document.createElement('button');
    // Setze button-type
    deleteCardBtn.type = 'button';
    // Hänge Bootrap Button Klassen an abhängig davon, ob Produkt bereits abgelaufen oder nicht
    deleteCardBtn.classList.add('btn', 'btn-sm', (isExpired ? 'btn-outline-danger' : 'btn-outline-primary'));

    // Prüfe, ob übergebenes Callback für den Löschknopf gültig ist
    if (typeof deleteCallback === 'function') {
        // Hänge übergebenes Callback auf das onClick-Event des Löschknopfs an
        deleteCardBtn.addEventListener('click', evt => {
            deleteCallback();
        });

    } else {
        // Gebe aus, dass übergebenes Callback ungültig ist
        console.log('%cDas mitgelieferte Callback zum Löschen des Produkts ist keine Funktion oder nicht vorhanden.', 'color: red;');
    }

    // Erstelle icon-Element für Löschknopf
    let deleteCardBtnIcon = document.createElement('i');
    // Hänge dem icon-Element abhängig von Ablaufszustand die entsprechende Bootstrap Klasse an
    deleteCardBtnIcon.classList.add('fa-solid', (isExpired ? 'fa-trash' : 'fa-utensils'));

    // Erstelle Untertitel Element
    let cardSubTitle = document.createElement('h6');
    // Hänge Bootstrap card-subtitle Klasse an Untertitel Element an
    cardSubTitle.classList.add('card-subtitle', 'mb-2', 'text-muted');

    // Wenn abgelaufen, ersetze Bootstrap Klasse für Textfarbe
    if (isExpired) cardSubTitle.classList.replace('text-muted', 'text-danger');
    // Wenn kurz vor Ablauf, ersetze Bootstrap Klasse für Textfarbe
    else if (new Date(productExpDate) - new Date() < ONE_DAY) cardSubTitle.classList.replace('text-muted', 'text-warning');
    // Befülle Untertitel Element mit übergebenem Ablaufsdatum
    cardSubTitle.innerText = productExpDate.toLocaleDateString('de-DE');

    // Erstelle Text-Element für Produkt-Volumen
    let cardText = document.createElement('p');
    // Hänge Bootstrap card-text Klasse an Text-Element an
    cardText.classList.add('card-text');

    // Befülle Text-Element mit übergebenem Produktvolumen

    console.log(productVolume);
    cardText.innerText = productVolume + " VU";

    // Hänge Lösch-Icon an Löschknopf an
    deleteCardBtn.appendChild(deleteCardBtnIcon);
    // Hänge Löschknopf an Card Titel an
    cardTitle.appendChild(deleteCardBtn);

    // Hänge Card Titel an Card-Body an
    cardBody.appendChild(cardTitle);
    // Hänge Card Untertiel an Card-Body an
    cardBody.appendChild(cardSubTitle);
    // Hänge Card Text an Card-Body an
    cardBody.appendChild(cardText);

    // Hänge Card-Body an Card-div an
    card.appendChild(cardBody);

    // Gebe fertige Klasse zurück
    return card;

}

//--------------------------------------------------------------------------------------------------------------------

// Render-Funktion für Produkt-Kacheln im Produkte-Container
function renderproducts(fridge) {
     
    // Entfernung aller bereits vorhandenen Produkt-Kacheln
    fridgeProductsContainer.replaceChildren();

    // Durchlaufe das Array aller eingelagerter Produkte in der übergebenen Fridge-Instanz
    fridge.storage.forEach((product, index) => {
        // Erstelle neue Date Instanz für jetzigen Zeitpunkt
        let today = new Date();
        // Date Instanz auf 00:00:00 Uhr gesetzt
        today.setHours(0, 0, 0, 0);
        // bestimme den Ablaufzustand durch Datumsvergleich vom Ablaufdatum des Produkts und aktuellem Datum
        let isExpired = product.expirationDate < today;

        // Definiere Funktion für das Lösch-Callback des Löschknopfs
        let deleteCallback = (fridge, index) => {
             // Entferne das Produkt anhand des Index aus dem Array in der Fridge-Instanz
            fridge.deleteProduct(index);
            // Rufe die allgemeine Render-Funktion auf, um neuen Zustand in der GUI darzustellen
            renderGui(fridge);

        }
        
        // Erzeuge mit der Card-Erstell-Funktion neue Produkt-Kachel und übergebe dieser die entsprechenden Daten, und das Callback zum Löschen des Produkts
        let produktcard = createNewProductCard(product.name, product.volume, product.expirationDate, isExpired, () => deleteCallback(fridge, index));

        // Hänge neu-erzeugte Produkt-Kachel an den Card-Container (Kühlschrank) an
        fridgeProductsContainer.appendChild(produktcard)
    });
}

// render-funktion zum Anzeigen der statistischen Daten

function renderStatusNumbers(fridge) {
    fridgeCapacitySpan.innerText = fridge.capacity;
    amountProductsSpan.innerText = fridge.totalProducts();
    freeCapacitySpan.innerText = fridge.freeCapacity();
    untilTomorrowSpan.innerText = fridge.amountUntilTomorrow();
    expiredProductsSpan.innerText = fridge.amountExpiredProducts();
    smallestProductSpan.innerText = fridge.smallestVU();
    biggestProductSpan.innerText = fridge.biggestVU();

}

// allgemeine Funktion für alle Datenbereiche der GUI
function renderGui(fridge) {
    renderproducts(fridge)
    renderStatusNumbers(fridge)

}


// ---------------------------------------------------Beispiele---------------------------------------------------------
let samsung = new Fridge(100, 'samsung');
let eier = new Product('eier', 10, new Date('2022-11-03'));
let tomaten = new Product('Tomaten', 15, new Date('2022-11-05'));
let joghurt = new Product('Joghurt', 5, new Date('2022-10-05'));
let gurken = new Product('Gurken', 6, new Date('2022-11-07'));
let zuchini = new Product('Zuchini', 5, new Date('2022-10-08'));
let milch = new Product('Milch', 6, new Date('2022-10-26'));




samsung.addProduct(eier)
samsung.addProduct(tomaten)
samsung.addProduct(joghurt)
samsung.addProduct(gurken)
samsung.addProduct(zuchini)
samsung.addProduct(milch);
renderGui(samsung);


// Setze clickHandler fuer addProductSubmitButton

addProductSubmitBtn.addEventListener('click', evt => {
    // wenn getrimmter Eingabewert fuer expDate nicht leer ist und getrimmter Eingabewert fuer ProduktVolumen nicht leer
    if ((addProductExpDateInput.value.trim().length > 0) && (addProductVolInput.value.trim().length > 0) && (addProductExpDateInput.value.trim().length > 0)) {
        // erstelle neues Produkt mit name, volume und expDate
        let name = addProductNameInput.value;
        let volume = parseInt(addProductVolInput.value);
        let expDate = new Date(addProductExpDateInput.value);
        let product = new Product(name, volume, expDate);
        samsung.addProduct(product);
        renderGui(samsung);
    }

})


// Setze clickHandler fuer cleanFridgButton
cleanFridgeButton.addEventListener('click', evt => {
    // loesche Produkte mit deleteExpProducts Methode. vergleiche ob Ablaufdatum groesser gleich heute ist.
    samsung.deleteExpProducts();
    renderGui(samsung);
})

// Setze clickHandler fuer sortProductButton
sortProductsButton.addEventListener('click', evt => {
    // Sortiere Produkte mit sortProducts Methode nach Vergleich der Ablaufdaten
    samsung.sortProducts();
    renderGui(samsung);
})

// Setze clickHandler fuer removeAllProductsButton
removeAllProductsButton.addEventListener('click', evt => {
    // loesche alle Produkte mit array-methode splice mit start 0
    samsung.deleteAllProducts();
    renderGui(samsung);
})



