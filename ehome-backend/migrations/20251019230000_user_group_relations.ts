// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_groups', (table) => {
    table.increments('id');
    table.integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.integer('group_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table.timestamps(true, true);

    table.unique(['user_id', 'group_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_groups');
}