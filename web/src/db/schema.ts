import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  name: text().notNull(),
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

export const contactMessages = pgTable('contact_messages', {
  id: serial().primaryKey(),
  naam: varchar('naam', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull(),
  bericht: text('bericht').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})