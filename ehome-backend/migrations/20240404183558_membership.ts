// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('membership', (table) => {
    table.increments('id')

    table.integer('uid').references('id').inTable('users')
    table.integer('gid').references('id').inTable('groups')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('membership')
}
