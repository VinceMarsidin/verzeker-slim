import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  name: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id: serial().primaryKey(),
  naam: varchar('naam', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull(),
  bericht: text('bericht').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})