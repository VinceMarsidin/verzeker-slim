import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

// ---------------------------------------------------------------------------
// better-auth tabellen
// Deze structuur volgt het schema dat better-auth verwacht voor de
// drizzle-adapter (zie src/lib/auth.ts). "role" is een eigen toevoeging
// bovenop het standaard user-schema, gebruikt om admins van gewone
// gebruikers te onderscheiden.
// ---------------------------------------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'), // 'user' | 'admin'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// Overig / voorbeeld
// ---------------------------------------------------------------------------

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// Business tabellen (verzekeringsdata) - oorspronkelijke set
// ---------------------------------------------------------------------------

export const maatschappijen = pgTable('maatschappijen', {
  id: serial('id').primaryKey(),
  naam: text('naam').notNull().unique(),
  logoUrl: text('logo_url'),
  contactEmail: text('contact_email'),
})

export const verzekeringen = pgTable('verzekeringen', {
  id: serial('id').primaryKey(),
  categorie: text('categorie').notNull(), // 'motor' | 'reis' | 'woon' | 'leven'
  type: text('type').notNull(), // bv. 'WA', 'Casco'
  premieBedrag: text('premie_bedrag').notNull(), // tekst, want kan ook "Op aanvraag" zijn
  maatschappijId: integer('maatschappij_id')
    .notNull()
    .references(() => maatschappijen.id, { onDelete: 'cascade' }),
})

export const contactBerichten = pgTable('contact_berichten', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id: serial().primaryKey(),
  naam: varchar('naam', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull(),
  bericht: text('bericht').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// Business tabellen - Vince's uitgebreide set (companies/premiums/reviews)
// ---------------------------------------------------------------------------

export const regionEnum = pgEnum('region', [
  'suriname',
  'aruba',
  'curacao',
  'bonaire',
  'trinidad',
  'jamaica',
  'guyana',
  'french-guiana',
])

export const insuranceTypeEnum = pgEnum('insurance_type', [
  'motor',
  'reis',
  'woon',
  'leven',
])

export const companies = pgTable('companies', {
  id: serial().primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  logoInitial: varchar('logo_initial', { length: 2 }).notNull(),
  region: regionEnum('region').notNull(),
  website: varchar('website', { length: 300 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const premiums = pgTable('premiums', {
  id: serial().primaryKey(),
  companyId: integer('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  insuranceType: insuranceTypeEnum('insurance_type').notNull(),
  monthlyPremium: real('monthly_premium').notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  deductible: real('deductible').notNull(),
  rating: real('rating').notNull(),
  coverage: text('coverage').array().notNull(),
  badge: varchar('badge', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const reviews = pgTable(
  'reviews',
  {
    id: serial().primaryKey(),
    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 255 }).notNull(),
    userName: varchar('user_name', { length: 100 }).notNull(),
    rating: integer('rating').notNull(),
    title: varchar('title', { length: 150 }).notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('reviews_company_user_unique').on(table.companyId, table.userId),
  ],
)