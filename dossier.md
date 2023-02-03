# Pieter Vandewalle (201637406)

- [x] Front-end Web Development
  - [GitHub repository](https://github.com/Web-IV/2223-frontendweb-PieterVandewalle)
  - [Online versie](https://frontendweb-tweedehandstech.onrender.com)
- [x] Web Services: 
  - [GitHub repository](https://github.com/Web-IV/2223-webservices-PieterVandewalle)
  - [Online versie](https://webservices-tweedehandstech.onrender.com)

**Logingegevens**

User in seed (Seed is ook eens uitgevoerd in production en deze user heeft al een aantal posts, favorites, conversations):
- Gebruikersnaam/e-mailadres: SeedUser
- Wachtwoord: r4P#vudmCCqbWLd

Testusers:

User:
- Gebruikersnaam/e-mailadres: e2e-testing
- Wachtwoord: r4P#vudmCCqbWLd

Admin (voor api calls als admin):
- Gebruikersnaam/e-mailadres: e2e-test-admin
- Wachtwoord: r4P#vudmCCqbWLd

## Projectbeschrijving

Mijn doel voor deze opdracht was een eenvoudige site te maken waar gebruikers zoekertjes kunnen plaatsen, bewerken, bekijken, van tweedehands tech-gerelateerde producten. Geïnteresseerde kopers kunnen zoekertjes toevoegen aan favorieten en een conversatie starten met de verkoper om een eventuele verkoop te bespreken
De categorieën en leveringswijzes kunnen door administrators aangepast worden vanuit de api om de site uit te breiden.

### Erd
![image](https://user-images.githubusercontent.com/67506292/207580270-775c54c8-37bc-4a71-bd85-590c2cde32b3.png)

## Screenshots

#### Posts bekijken

![image](https://user-images.githubusercontent.com/67506292/207581945-f88bf3e2-bf07-4700-9657-cad34e16d501.png)

#### Posts Filteren
![image](https://user-images.githubusercontent.com/67506292/207582079-8434a3a3-709c-4cb4-b2fc-dff465722320.png)


#### Zoekopdracht uitvoeren
![image](https://user-images.githubusercontent.com/67506292/207582285-7ce85221-1d17-4ecd-8aa4-d304dad1e892.png)


#### Post toevoegen aan favorieten
![image](https://user-images.githubusercontent.com/67506292/207582464-d70672f9-6b74-4f4f-97bf-7b9855a05525.png)


#### Favoriete posts bekijken
![image](https://user-images.githubusercontent.com/67506292/207582659-479e36d5-67b1-4e20-824e-672059ae5831.png)


#### Post plaatsen
![image](https://user-images.githubusercontent.com/67506292/207583718-57206458-28c5-4733-bca6-ea612a9a6e26.png)
![image](https://user-images.githubusercontent.com/67506292/207583859-de5f060e-53a2-461d-b2fa-726544e43ceb.png)


#### Geplaatste posts bewerken / verwijderen
![image](https://user-images.githubusercontent.com/67506292/207583495-dc8db1f3-cb4c-4934-a676-70948181134c.png)


#### Conversaties bekijken en chatten
![image](https://user-images.githubusercontent.com/67506292/207584009-e3d1fa7f-fd16-41ca-a052-c52ddf15ac5b.png)
![image](https://user-images.githubusercontent.com/67506292/207584080-e09657bb-81d5-4297-a620-bbcba015bf1c.png)

#### Categorieën en posts in een categorie bekijken
![image](https://user-images.githubusercontent.com/67506292/207584438-1b4bd4b7-0c13-4ff6-88ef-989273e1c7b3.png)
![image](https://user-images.githubusercontent.com/67506292/207584465-9ea13398-0364-4c96-b854-0b7d18d5b625.png)

## Behaalde minimumvereisten

### Front-end Web Development

- **componenten**

  - [x] heeft meerdere componenten - dom & slim (naast login/register)
  - [x] definieert constanten (variabelen, functies en componenten) buiten de component
  - [x] minstens één form met validatie (naast login/register)
  - [x] login systeem (eigen of extern zoals bv. Auth0)
<br />

- **routing**
  - [x] heeft minstens 2 pagina's (naast login/register)
  - [x] routes worden afgeschermd met authenticatie en autorisatie
<br />

- **state-management**

  - [x] meerdere API calls (naast login/register)
  - [x] degelijke foutmeldingen indien API call faalt
  - [x] gebruikt useState enkel voor lokale state
  - [x] gebruikt Context, useReducer, Redux… voor globale state
<br />

- **hooks**

  - [x] kent het verschil tussen de hooks (useCallback, useEffect…)
  - [x] gebruikt de hooks op de juiste manier
<br />

- **varia**
  - [x] een aantal niet-triviale testen (unit en/of e2e en/of ui)
  - [x] minstens één extra technologie
  - [x] duidelijke en volledige README.md
  - [x] volledig en tijdig ingediend dossier


### Web Services

- **datalaag**

  - [x] voldoende complex (meer dan één tabel)
  - [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
  - [x] heeft migraties
  - [x] heeft seeds
<br />

- **repositorylaag**

  - [x] definieert één repository per entiteit (niet voor tussentabellen) - indien van toepassing
  - [x] mapt OO-rijke data naar relationele tabellen en vice versa
<br />

- **servicelaag met een zekere complexiteit**

  - [x] bevat alle domeinlogica
  - [x] bevat geen SQL-queries of databank-gerelateerde code
<br />

- **REST-laag**

  - [x] meerdere routes met invoervalidatie
  - [x] degelijke foutboodschappen
  - [x] volgt de conventies van een RESTful API
  - [x] bevat geen domeinlogica
  - [x] degelijke authorisatie/authenticatie op alle routes
<br />

- **varia**
  - [x] een aantal niet-triviale testen (min. 1 controller >=80% coverage)
  - [x] minstens één extra technologie
  - [x] duidelijke en volledige `README.md`
  - [x] maakt gebruik van de laatste ES6-features (object destructuring, spread operator...)
  - [x] volledig en tijdig ingediend dossier


## Projectstructuur

### Front-end Web Development

```
src
|___ api
|___ components
|___ contexts
|___ hooks
|___ images
|___ pages
|___ utils
```
De api folder bevat alle hooks om de api aan te roepen. Ik heb ervoor gekozen om ook een index.js bestand te maken die het axios object maakt met de correcte baseURL van mijn api.

De components folder bevat alle components die geen pagina op zichzelf vormen. Deze folder heb ik ook nog verder onderverdeeld in:
- badges
- buttons
- formInputs
- posts
- toasts

Deze components worden in verschillende components van de pages folder gebruikt. Zo wordt de mutationButton gebruikt bij alle mutations waarbij een loading spinner moet getoond worden vb. plaatsen van een post, maken van een conversatie, verzenden van een bericht. De formInputs worden gebruikt in de PostListFilter op de homepage, en bij de PostForm pagina. Ik heb hierbij onderscheid gemaakt tussen een normale Select en een Select waarbij de data moet opgehaald worden met een useQuery.

In de contexts folder staat de Auth0Provider en de UserContext, die verantwoordelijk is voor het bijhouden en aangeven van de username en id van de gebruiker.
De hooks folder bevat een aantal aangepaste useQuery hooks die in verschillende components gebruikt worden, om dupliceren van code te voorkomen.
De images folder (zou ook assets kunnen zijn, maar in mijn geval had ik enkel afbeeldingen) houdt enkele afbeeldingen bij die in de app gebruikt worden.
In pages heb ik de components gezet die de basis van een pagina vormen. Deze components zijn dan ook verantwoordelijk voor het gebruik van de api hooks en geven de data door naar hun kinderen.

De PostList en PostListItem components zijn aanwezig op verschillende pagina's: Homepage, My Posts en My Favorites. Ze zorgen ervoor dat de data die aangegeven wordt door hun parent omgevormd wordt in een lijst van posts. Daarnaast zorgt de PostList ook voor de navigatie tussen pagina's (adhv. de buttons previous en next) en voor een correcte boodschap indien er geen posts zijn.

### Web Services

Mijn applicatie gebruikt een gelaagde architectuur: rest laag, servicelaag, repositorylaag en datalaag. Mijn datalaag instantieert de PrismaClient, maakt een azure container (indien die nog niet bestaat) en seed the database in development. Migrations bevinden zich niet in de datalaag aangezien dit wordt afgehandeld met Prisma CLI commando's. In de repositorylaag voer ik met Prisma "queries" uit en format ik de objecten indien nodig. Ik heb er ook voor gekozen om mijn select statements in een apart bestand te plaatsen. Dit maakt het selecteren van de data gemakkelijker en zorgt voor consistentie.

## Extra technologie

### Front-end Web Development

#### React Query
https://www.npmjs.com/package/react-query

React Query is een library die het ophalen, cachen, synchroniseren en updaten van server state vereenvoudigt.

Onderstaande code toont één van de voordelen van useQuery toegepast op de voorbeeldapplicatie:
```
// Zonder useQuery
const refreshTransactions = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await transactionsApi.getAll();
    setTransactions(data);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  refreshTransactions();
}, [refreshTransactions]);
  
// Met useQuery
const { data, isLoading, error} = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
        const data = await transactionsApi.getAll();
        return data;
    }
});
```
Naast de useQuery hook biedt React Query ook een hook aan om create/update/delete uit te voeren d.m.v. de useMutation hook.

Ik heb in mijn project enkel data opgehaald a.d.h.v. useQuery en mutations uitgevoerd met useMutation.

#### React-hot-toast
https://www.npmjs.com/package/react-hot-toast

React-hot-toast maakt het weergeven van toasts heel eenvoudig. Het heeft handlers die toast kunnen pauzeren wanneer je erover hovert, verwijdert toasts na ingestelde tijd en ondersteunt animaties bij het unmounten van toasts.
Om het te gebruiken dien je enkel een `<Toaster/>` component toe te voegen die gebruikt wordt om alle toasts te renderen.
Daarna kan je vanuit components een toast aanmaken door `toast()` aan te roepen  vb. `toast.success("success messsage")`

De implementatie van de Toaster component bevindt zich in de `<NotificationToast/>` component van mijn project.
In deze component voeg ik een render function toe aan de `<ToastBar/>` component waardoor toasts van Flowbite React kan gebruiken.
Toasts worden weergegeven bij het toevoegen en verwijderen van posts aan favorieten, tonen van errors, etc.


#### Flowbite-react
https://www.npmjs.com/package/flowbite-react

Flowbite-React is een open-source collectie van React UI components. Het is gebouwd met klassen van Tailwind CSS.
Na het toevoegen van Flowbite-React aan je project kan je components vb. een button importeren door 
`import { Button } from "flowbite-react"` te gebruiken.

De components hebben verschillende properties die kunnen meegegeven worden om ze aan te passen.
Zo hebben buttons bijvoorbeeld een propertie pill. Wanneer deze property true is zal de button een pilvorm hebben.

### Web Services

#### Prisma
https://www.npmjs.com/package/prisma

Prisma is een ORM (Object Relational Mapper). Het zorgt ervoor dat een ontwikkelaar weinig of geen kennis van Sql nodig heeft om de databank te ontwerpen en queries te schrijven. Het database schema wordt gegenereert d.m.v. het door de gebruiker gedefinieerde Prisma schema. Na het maken van een schema kan de gebruiker data ophalen door de PrismaClient aan te spreken. Deze geeft objecten terug, wat het zeer handig is.


#### Multer & Multer-azure-blob-storage
https://www.npmjs.com/package/multer
https://www.npmjs.com/package/multer-azure-blob-storage

Multer is een nodejs middleware voor het behandelen van multipart/form-data. Multer voegt een body object toe aan de request.
Dit body object bevat keys en values van de tekstvelden van de form, maar ook de bestanden die werden geupload.

Standaard heeft Multer twee storage engines: DiskStorage en MemoryStorage. 
Om bestanden rechtstreeks naar Azure te uploaden kan de multer-azure-blob-storage storage engine gebruikt worden.

De code hiervan staat in /core/image en ik gebruik deze middleware in mijn POST en PUT endpoints van /posts en /categories.


## Testresultaten

### Front-end Web Development

- Plaatsen van een post -> nakijken of de post op de homepagina te zien is in de correcte categorie -> post verwijderen
- Homepagina toont de correcte posts uit de fixture
- Bij een trage response wordt loading card weergegeven
- Filteren op prijs toont correcte posts
- Filteren Minimum prijs > maximum prijs toont error
- Filteren op deliveryType geeft correcte posts terug met gekozen deliveryType
- Sorteren op prijs geeft gesorteerde posts weer
- Resetten van de filters werkt 
- Indien er geen posts zijn wordt "No posts yet" weergegeven
- Error van backend wordt weergegeven

![image](https://user-images.githubusercontent.com/67506292/207601888-9e9bbaaa-8860-45b4-a23b-dc1e7909727e.png)

![image](https://user-images.githubusercontent.com/67506292/207602144-c04b2f77-2536-4691-affd-c8d331398dd6.png)


### Web Services

Ik heb ervoor gekozen om mijn /post endpoints zo goed mogelijk te testen:
- Als niet-ingelogde gebruiker
- Als ingelogde gebruiker
- Als ingelogde admin

Bij deze tests worden alle validatieregels getest bij het plaatsen van een post en het updaten van een post. 
Daarnaast wordt er gekeken of de correcte data teruggegeven wordt bij alle requests (inclusief requests met query parameters zoals limit, offset, minPrice,..)
Ook de authorisatie en authenticatie wordt getest.

Bij mijn /categories endpoint heb ik gelijkaardige testen uitgevoerd.

Naast bovenstaande integration tests heb ik ook een aantal unit tests geschreven:
- Nakijken of ServiceError.forbidden gethrowt wordt als een gebruiker die niet in de conversatie zit de conversatie opvraagt, maar dit niet doet als de gebruiker de conversatie wel mag bekijken.
- Nakijken of de deleteBlobs methode de aangegeven images verwijdert uit de Azure Storage container


#### Uitvoering tests
![image](https://user-images.githubusercontent.com/67506292/208262991-02c5308f-b6f3-4ef4-b1ce-0c235011660f.png)
![image](https://user-images.githubusercontent.com/67506292/208263025-62502fd7-3700-4b39-a744-ea628295cb47.png)


#### Coverage
![image](https://user-images.githubusercontent.com/67506292/207595099-605ff380-5bed-4bd8-9b07-62d95c188287.png)
![image](https://user-images.githubusercontent.com/67506292/207598641-c9415fca-586b-4644-b648-c2bad9e46851.png)


## Gekende bugs

### Front-end Web Development
/

### Web Services
/

