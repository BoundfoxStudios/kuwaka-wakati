import { DatabaseCleanup, DatabaseTable } from '../database/database.service';
import { Settings } from './settings';
import { liveQuery, Table } from 'dexie';
import { Injectable } from '@angular/core';
import { shareReplay, startWith } from 'rxjs';
import { dexieToRxObservable } from '../dexie-to-rxjs';

interface SettingsEntity extends Settings {
    id?: number;
}

const defaultSettings: Settings = {
    workPerDay: 27_000_000, // 7.5 hours
};

@Injectable()
export class SettingsTable implements DatabaseTable<SettingsEntity>, DatabaseCleanup {
    readonly definition = '++id';
    readonly name = 'settings';
    readonly version = 1;
    private settings!: Table<SettingsEntity, number>;

    readonly current$ = dexieToRxObservable(
        liveQuery(async (): Promise<SettingsEntity> => {
            const entity = await this.settings.orderBy('id').last();

            if (!entity) {
                return defaultSettings;
            }

            return { ...entity, id: undefined };
        }),
    ).pipe(shareReplay());

    async update(settings: Settings): Promise<void> {
        await this.settings.add(settings);
    }

    initialize(table: Table<SettingsEntity, number>): void {
        this.settings = table;
    }

    async cleanup(): Promise<void> {
        const allKeys = await this.settings.toCollection().primaryKeys();
        const maxId = Math.max(...allKeys);
        const allKeysWithoutMaxId = allKeys.filter(key => key !== maxId);
        await this.settings.bulkDelete(allKeysWithoutMaxId);
    }
}
