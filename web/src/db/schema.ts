import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
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
// Business tabellen (verzekeringsdata)
// Gebaseerd op het oude Prisma-schema (Maatschappij / Verzekering / ContactBericht)
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
