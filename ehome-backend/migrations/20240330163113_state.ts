// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('states', (table) => {
    table.increments('id')

    table.string('name')
    table.string('MAC')
    table.string('value')
    table.smallint('type').notNullable();
    table.json('options').nullable();
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('states')
}
