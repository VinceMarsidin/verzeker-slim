Command used
npm init -y                                         Initialiseert een nieuw Node.js project.
npm install express                                 Installeert Express.js.
npm install bcrypt                                  Installeert bcrypt.
npm install jsonwebtoken                            Installeert jsonwebtoken.
npm install cors                                    Installeert cors.
npm install dotenv                                  Installeert dotenv.     
npm install nodemon --save-dev                      Installeert Nodemon.
npx pnpm install prisma@6 @prisma/client@6          Installeert Prisma versie 6.
npx prisma generate                                 Bereidt de Prisma-functies 
npx prisma migrate dev                              Maakt de database-tabellen aan (dev.db).
npm run dev/node server.js                          Start je applicatie.

Used on different computers
npm i                                               Installeert alle software-pakketten van package.json.
npm run dev/node server.js                          Start je applicatie.

- Login CMS Dashboard: http://localhost:3000/admin-login.html
- Create admin user: node createAdmin.js
- Beheer het database via Prisma via de command line: npx prisma studio




----------Folder Structure:----------

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
