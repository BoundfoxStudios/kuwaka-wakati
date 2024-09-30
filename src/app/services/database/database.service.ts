import { Inject, Injectable, InjectionToken } from '@angular/core';
import Dexie, { Table } from 'dexie';
import 'dexie-export-import';
import { SettingsEntity } from '../settings/settings.table';
import { DateTime } from 'luxon';

export interface DatabaseTable<T = unknown, TKey = number> {
    readonly version: number;
    readonly name: string;
    readonly definition: string;

    initialize(table: Table<T, TKey>): void;
}

export interface DatabaseCleanup {
    cleanup(): Promise<void>;
}

const implementsDatabaseCleanup = (input: unknown): input is DatabaseCleanup => {
    return !!(input as DatabaseCleanup).cleanup;
};

export const DATABASE_TABLE = new InjectionToken<DatabaseTable>('DatabaseTable');

@Injectable({
    providedIn: 'root',
})
export class DatabaseService extends Dexie implements DatabaseCleanup {
    constructor(@Inject(DATABASE_TABLE) private readonly databaseTables: DatabaseTable[]) {
        super('kuwaka-wakati');

        const version = databaseTables.reduce((sum, current) => sum + current.version, 0);

        this.version(version)
            .stores(databaseTables.reduce((schema, table) => ({ ...schema, [table.name]: table.definition }), {}))
            .upgrade(async transaction => {
                const settingsTable = transaction.table<SettingsEntity>('settings');
                const allItems = await settingsTable.toArray();
                await settingsTable.bulkPut(
                    allItems.map(item => ({
                        ...item,
                        lastBackup: item.lastBackup ?? DateTime.now().toMillis(),
                    })),
                );
            });
    }

    initialize(): void {
        this.databaseTables.forEach(table => table.initialize(this.table(table.name)));
    }

    async cleanup(): Promise<void> {
        for (const table of this.databaseTables) {
            if (implementsDatabaseCleanup(table)) {
                await table.cleanup();
            }
        }
    }

    async exportToBlob(): Promise<Blob> {
        return this.export();
    }

    async importFromBlob(blob: Blob): Promise<void> {
        return this.import(blob, { clearTablesBeforeImport: true });
    }

    async clear(): Promise<void> {
        await this.delete();
    }
}

export const databaseInitializerFactory = (databaseService: DatabaseService) => (): Promise<void> => {
    databaseService.initialize();
    return databaseService.cleanup();
};

export const databaseInitializerFactoryDeps = [DatabaseService];
