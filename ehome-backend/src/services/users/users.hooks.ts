import type { HookContext } from '../../declarations';
import { Paginated } from '@feathersjs/feathers';
import { logger } from '../../logger';

// Hook zum Speichern der userGroups
export const saveUserGroups = async (context: HookContext) => {
  const { app, result, data } = context;
  
  if (!data || !data.userGroups) {
    return context;
  }

  logger.info('Saving user groups for user id %s: %o', data.id, data);
  
  const userId = result?.id;
  logger.info('Determined user id: %o', userId);
  const knex = app.get('sqliteClient');

  try {
    if (userId !== undefined) {
      await knex('user_groups').where('user_id', userId).del();
    }

    if (Array.isArray(data.userGroups) && data.userGroups.length > 0) {
      const userGroupRecords = data.userGroups.map((group: any) => ({
        user_id: userId,
        group_id: typeof group === 'object' ? group.id : group
      }));

      logger.info('Inserting user group records: %o', userGroupRecords);

      await knex('user_groups').insert(userGroupRecords);
    }
  } catch (error) {
    console.error('Error saving user groups:', error);
    throw error;
  }
  
  return context;
};

// Hook zum Laden der userGroups
export const populateUserGroups = async (context: HookContext) => {
  const { app, result } = context;
  const knex = app.get('sqliteClient');
  
  const loadGroups = async (userId: number) => {
    return await knex('user_groups')
      .join('groups', 'user_groups.group_id', 'groups.id')
      .where('user_groups.user_id', userId)
      .select('groups.*');
  };
  
  try {
    // Einzelnes Ergebnis (get, create, update, patch)
    if (result && result.id && !result.data) {
      result.userGroups = await loadGroups(result.id);
    }
    
    // Mehrere Ergebnisse (find)
    if (result && result.data && Array.isArray(result.data)) {
      const resultData = result as Paginated<any>;
      for (const user of resultData.data) {
        if (user.id) {
          user.userGroups = await loadGroups(user.id);
        }
      }
    }
  } catch (error) {
    console.error('Error loading user groups:', error);
    // Optional: Fehler schlucken und leeres Array zurückgeben
    if (result && result.id) {
      result.userGroups = [];
    }
  }
  
  return context;
};

// Hook um userGroups aus den Daten zu entfernen (wird separat gespeichert)
export const removeUserGroupsFromData = async (context: HookContext) => {
  if (context.data && context.data.userGroups) {
    // Temporär speichern für späteren Zugriff
    context.params.userGroups = context.data.userGroups;
    delete context.data.userGroups;
  }
  return context;
};

// Hook um userGroups wiederherzustellen
export const restoreUserGroups = async (context: HookContext) => {
  if (context.params.userGroups) {
    context.data = context.data || {};
    context.data.userGroups = context.params.userGroups;
  }
  return context;
};