import { Inject, Injectable, InjectionToken } from '@angular/core';
import Dexie, { Table } from 'dexie';

export interface DatabaseTable<T = unknown, TKey = number> {
    readonly version: number;
    readonly name: string;
    readonly definition: string;

    initialize(table: Table<T, TKey>): void;
}

export const DATABASE_TABLE = new InjectionToken<DatabaseTable>('DatabaseTable');

@Injectable({
    providedIn: 'root',
})
export class DatabaseService extends Dexie {
    constructor(@Inject(DATABASE_TABLE) private readonly databaseTables: DatabaseTable[]) {
        super('kuwaka-wakati');

        const highestVersion = Math.max(...databaseTables.map(table => table.version));

        this.version(highestVersion).stores(databaseTables.reduce((schema, table) => ({ ...schema, [table.name]: table.definition }), {}));
    }

    initialize(): void {
        this.databaseTables.forEach(table => table.initialize(this.table(table.name)));
    }
}

export const databaseInitializerFactory = (databaseService: DatabaseService) => (): Promise<void> => {
    databaseService.initialize();
    return Promise.resolve();
};

export const databaseInitializerFactoryDeps = [DatabaseService];
