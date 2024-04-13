// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('groups', (table) => {
    table.increments('id')

    table.string('name').primary()

    // DeviceIds as JSON-Array
    table.string('devices').nullable()

  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('groups')
}
