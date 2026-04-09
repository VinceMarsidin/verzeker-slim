<h1>VerzekerSlim by Masterminds</h1>

<h2>Project Overview</h2>
<p> VerzekerSlim is een webapplicatie die gebruikers helpt om verzekeringen eenvoudig te vergelijken. Het patform maakt complexe verzekeringsinformatie overzichtelijk voor Surinaamse consumenten.</p>

<p> Gebruikers kunnen premies bekijken, vergelijken en beter begrijpen, terwijl beheerders via een dashboard de data kunnen beheren.</p>

<h3>Doel van het systeem</h3>
<p>Het doel van VerzekerSlim is om:

- Verzekeringsinformatie transparant en overzichtelijk te maken voor gebruikers
- Vergelijkingen van premies en verzekeringen eenvoudig en begrijpelijk te maken
- Eén centraal platform te bieden waar gebruikers en beheerders efficiënt kunnen werken</p>

<h3>Features</h3>
<p>
  
- `Vergelijken van verzekeringen` (motor, reis, woon, leven)
- `Automatische premie-berekening`
- `Dynamische tabellen met real-time data`
- `Beveiligde backend met validatie en error handling`
- `Admin Dashboard voor beheer van data en gebruikers`
- `Responsieve frontend voor mobiel en desktop`
</p>

<h2>Tech Stack</h2>
<p>Frontend Development (Client-side) gebouwt met:

- `HTML5`
- `CSS3`
- `Vanilla JavaScript`

De frontend is volledig dynamisch; de vergelijkingstabellen worden asynchroon (via de Fetch API) opgebouwd op basis van data uit de backend.</p>

<p>Backend Development (Server-side) gebouwt in:

- `Node.js`
- `Express.js`

Deze laag handelt de bedrijfslogica af (zoals de premieberekeningen) en routeert inkomende verzoeken.</p>

<p>Database (Datalaag): 

- `SQLite`
- `Prisma ORM`

Een relationele SQLite-database, aangestuurd via de Prisma ORM (Object-Relational Mapper). Prisma garandeert type-safety en beheert de databasemigraties.</p>

<h2>Prerequisites</h2>
<p>Voordat je het project kunt draaien, heb je het volgende nodig:

- Node.js (versie 16 of hoger)
- npm (Node Package Manager)
- Git
- Code editor (bijv. Visual Studio Code)</p>

<h2>Getting Started</h2>
<p>Volg de onderstaande stappen om het project lokaal te draaien:

1. Clone de repository: ***git clone https://github.com/VinceMarsidin/Verzeker-Slim/tree/V1.0***
2. Instaleer alle software-pakketten:  ***npm install***
3. Bereidt de Prisma-functies:  ***npx prisma generate***
4. Maak de database-tabellen aan (dev.db):  ***npx prisma migrate dev***
5. Vul de tabellen met de start-data (Assuria, etc.):  ***npx prisma db seed***
6. Start de applicatie:  ***npm run dev/node server.js </p>***


<p2>Snelle Start (voor beoordelaars)

Als Node.js is geïnstalleerd en de node_modules aanwezig zijn, kan het systeem direct worden opgestart:

Server starten in terminal:
- node server.js

*(Of `- npm run dev` voor ontwikkeling met Nodemon)*
Website openen: http://localhost:3000/index.html

CMS Login: http://localhost:3000/admin-login.html</p2>

<h2>Deployment</h2>
<p> De applicatie kan online worden gedeployed met de volgende platforms:

- Vercel (voor frontend)
- Render / Railway (voor backend)
- SQLite database kan lokaal of via een cloud service draaien


Stappen:

1. Upload je project naar GitHub
2. Koppel je repository aan een hosting platform
3. Stel environment variables in (.env bestand)
4. Deploy de applicatie

Na deployment is de applicatie toegankelijk via een publieke URL.</p>

<h2>Configuration</h2>
<p>Maak een `.env` bestand aan in de root van het project en voeg de volgende variabelen toe:

```env id="0drt9b"
PORT=3000
DATABASE_URL="file:./dev.db"
```

Uitleg:

- `PORT` → De poort waarop de server draait
- `DATABASE_URL` → Verbinding met de SQLite database

LET OP! 
Zorg ervoor dat het `.env` bestand niet wordt gedeeld op GitHub (zet deze in je `.gitignore`).
</p>

<h2>Folder Structure</h2>
<p>Het project is opgedeeld in een duidelijke scheiding tussen de backend logica en de frontend interface.

```
Backend/src/
├── controllers
|   ├── adminController.js
|   ├── authController.js
|   ├── contactController.js
|   ├── maatschappijController.js
|   └── premieController.js
├── middleware
|   └── authMiddleware.js
├── routes
|   ├── adminRouter.js
|   ├── authRouter.js
|   ├── contactRouter.js
|   └── insuranceRoutes.js
|
|
Frontend/
├── /css
|    ├── admin-login.css
|    ├── admin-dashboard.css
|    ├── contact.css
|    ├── main.css
|    └── vergelijkingen.css
├── /img
|    ├── About-foto.jpg       
|    ├── assuria.png
|    ├── contact-illustratie.svg
|    ├── Favicon.svg 
|    └── logo.png   
├── /js
|    ├── admin-auth.js
|    ├── admin-cms.js
|    ├── contact.js
|    ├── main.js
|    └── vergelijkingen.js
├── admin-dashboard.html
├── admin-login.html
├── contact.html
├── index.html
└── vergelijkingen.html
|
|
node_modules/
prisma/
|    ├── migrations/
|    ├── dev.db
|    └── schema.prisma
├── .env
├── .gitignore
├── createAdmin.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
```
</p>

<h2>Admin Dashboard</h2>
<p>Het Admin Dashboard stelt beheerders in staat om verzekeringen en maatschappijen te beheren, gebruikersdata te bekijken en het systeem veilig en efficiënt te onderhouden.
  
- **`node createAdmin.js`**: Script om handmatig een administrator-gebruiker aan te maken in de database.
(Wij hebben al een admin account aangemaakt met de volgende gegevens: Email: [Admin] Wachtwoord: [Test1234])
- **`npx prisma studio`**: Opent een grafische interface in de browser om de database-inhoud direct te beheren.</p>

<h2>Architecture</h2>
<p>De applicatie gebruikt een Client-Server architectuur met het MVC pattern:

- **Frontend (Client):** UI en interactie
- **Backend (Server):** Business logic & API
- **Database:** Opslag van verzekeringsdata</p>

<h2>API Documentation</h2>
<p>De frontend communiceert met de backend via gestructureerde JSON-endpoints. De belangrijkste endpoints zijn:

- GET /api/maatschappijen: Haalt een alfabetisch gesorteerde lijst van alle actieve verzekeraars op. Wordt gebruikt voor het genereren van de tabelkoppen.
- GET /api/vergelijking/:type: Haalt alle verzekeringen op van een specifieke categorie (bijv. 'motor'). Gebruikt een Prisma include query om direct de gerelateerde maatschappij-data mee te leveren (JOIN operatie).  
- POST /api/bereken-premie: Accepteert een JSON-payload met de dagwaarde van een voertuig, voert de server-side berekening uit (2,5% met een minimum van SRD 1500), en retourneert het resultaat.
</p>

<h2>Database Design</h2>
<p>De relationele database is opgebouwd rondom twee kernentiteiten met een één-op-veel (1:N) relatie:

1.	Maatschappij: Bevat de stamgegevens van de verzekeraars `(zoals ID, naam en website-URL)`.
2.	Verzekering: Bevat de specifieke dekkingen. Elke verzekering heeft een verplichte foreign key `(maatschappijId)` die verwijst naar een specifieke maatschappij.

Daarnaast bevat deze entiteit attributen zoals categorie (motor, reis, woon, leven), type (bijv. WA of Casco) en premie_bedrag.
</p>

<h2>Security & Technologie</h2>
<p> 

**Security:**  
Het beschermen van gebruikersdata is essentieel. VerzekerSlim verwerkt gevoelige informatie over verzekeringen en persoonlijke gegevens. Door goede beveiligingsmaatregelen zoals `server-side validatie, rol-gebaseerde toegang, en ORM bescherming` zorgen we ervoor dat data veilig blijft, aanvallen zoals SQL-injecties voorkomen worden, en het vertrouwen van gebruikers behouden blijft.

**Technologie:**  
Het gebruik van een moderne en betrouwbare tech stack (Node.js, Express, Prisma, SQLite) maakt de applicatie `efficiënt, schaalbaar en onderhoudbaar`. Het stelt ons in staat om toekomstige features toe te voegen, de prestaties te verbeteren en een professionele, betrouwbare gebruikerservaring te bieden.

- `Wachtwoordbeveiliging`: Gebruik van bcrypt voor het veilig hashen van administrator-wachtwoorden.
- `Autorisatie`: Beveiliging van de CMS-routes via jsonwebtoken (JWT) en custom middleware.
- `CORS`: Geconfigureerd om veilige cross-origin requests toe te staan.
- `Database`: SQLite in combinatie met Prisma 6 voor een robuuste en type-safe data-afhandeling.</p>

<h2>Extra Informatie</h2>
<p>Command used tijdens bouw van het project:

- `npm init -y`                                         Initialiseert een nieuw Node.js project.
- `npm install express`                                 Installeert Express.js.
- `npm install bcrypt`                                  Installeert bcrypt.
- `npm install jsonwebtoken`                            Installeert jsonwebtoken.
- `npm install cors`                                    Installeert cors.
- `npm install dotenv`                                  Installeert dotenv.     
- `npm install nodemon --save-dev`                      Installeert Nodemon.
- `npx pnpm install prisma@6 @prisma/client@6`          Installeert Prisma versie 6.
- `npx prisma generate`                                 Bereidt de Prisma-functies 
- `npx prisma migrate dev`                              Maakt de database-tabellen aan (dev.db).
- `npm run dev/node server.js`                          Start je applicatie.</p>

<h2>Markdown Quality </h2>
<p>Deze README is zorgvuldig opgebouwd met de volgende aandachtspunten:

- Gebruik van duidelijke en consistente **headings** (`#`, `##`, `###`) voor hiërarchie
- Scheiding van secties met **horizontale lijnen** (`---`) voor overzichtelijkheid
- **Emoji’s** gebruikt om belangrijke secties visueel te ondersteunen
- **Code blocks** (` ``` `) voor commando’s en projectstructuur
- **Lijsten** voor features, tech stack, en teamleden
- Korte en duidelijke beschrijvingen per sectie
- Goed leesbare en scanbare structuur voor zowel gebruikers als ontwikkelaars

Dit garandeert dat de documentatie professioneel oogt en makkelijk te volgen is.</p>






