import { pgTable, serial, text, timestamp, varchar, integer, real, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core'

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
