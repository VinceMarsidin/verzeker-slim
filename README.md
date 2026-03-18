|---------------------------------------Systeemhandleiding: VerzekerSlim Platform----------------------------------------|
Dit document bevat de technische specificaties, installatie-instructies en de mappenstructuur van het VerzekerSlim-platform.



----------------------------------------Snelle Start (Voor beoordelaars)----------------------------------------
Als Node.js is geïnstalleerd en de node_modules aanwezig zijn, kan het systeem direct worden opgestart:

Server starten in terminal:
- node server.js

*(Of `- npm run dev` voor ontwikkeling met Nodemon)*
Website openen: http://localhost:3000/index.html

CMS Login: http://localhost:3000/admin-login.html



|---------------------------------------- Installatie & Commando's----------------------------------------|
Mocht de applicatie op een nieuw systeem worden opgezet, gebruik dan de volgende commando's:

Initialisatie
- npm i: Installeert alle vereiste packages uit package.json (Express, Prisma, JWT, Bcrypt, CORS, Dotenv).

- npx prisma generate: Bereidt de Prisma-client functies voor op basis van het schema.

- npx prisma migrate dev: Synchroniseert het schema en maakt de database-tabellen aan in dev.db.



|----------------------------------------Beheer----------------------------------------|
- node createAdmin.js: Script om handmatig een administrator-gebruiker aan te maken in de database.
(Wij hebben al een admin account aangemaakt met de volgende gegevens: Email: [Admin] Wachtwoord: [Test1234])

- npx prisma studio: Opent een grafische interface in de browser om de database-inhoud direct te beheren.



|------------------------------------- Projectstructuur (Architectuur)----------------------------------------|
Het project is opgedeeld in een duidelijke scheiding tussen de backend logica en de frontend interface.

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



|---------------------------------------- Veiligheid & Technologie----------------------------------------|
Wachtwoordbeveiliging: Gebruik van bcrypt voor het veilig hashen van administrator-wachtwoorden.

Autorisatie: Beveiliging van de CMS-routes via jsonwebtoken (JWT) en custom middleware.

CORS: Geconfigureerd om veilige cross-origin requests toe te staan.

Database: SQLite in combinatie met Prisma 6 voor een robuuste en type-safe data-afhandeling.




|----------------------------------------Extra informatie----------------------------------------|
Command used tijdens bouw van het project:
- npm init -y                                         Initialiseert een nieuw Node.js project.
- npm install express                                 Installeert Express.js.
- npm install bcrypt                                  Installeert bcrypt.
- npm install jsonwebtoken                            Installeert jsonwebtoken.
- npm install cors                                    Installeert cors.
- npm install dotenv                                  Installeert dotenv.     
- npm install nodemon --save-dev                      Installeert Nodemon.
- npx pnpm install prisma@6 @prisma/client@6          Installeert Prisma versie 6.
- npx prisma generate                                 Bereidt de Prisma-functies 
- npx prisma migrate dev                              Maakt de database-tabellen aan (dev.db).
- npm run dev/node server.js                          Start je applicatie.


