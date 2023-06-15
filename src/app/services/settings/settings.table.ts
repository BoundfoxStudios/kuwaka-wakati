import { DatabaseCleanup, DatabaseTable } from '../database/database.service';
import { Settings } from './settings';
import { liveQuery, Table } from 'dexie';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

interface SettingsEntity extends Settings {
    id?: number;
}

const defaultSettings: Settings = {
    minutesToWorkPerWeek: 2250, // 37.5 hours
};

@Injectable()
export class SettingsTable implements DatabaseTable<SettingsEntity>, DatabaseCleanup {
    readonly definition = '++id';
    readonly name = 'settings';
    readonly version = 1;
    private settings!: Table<SettingsEntity, number>;

    current(): Signal<Settings> {
        return toSignal(
            liveQuery(async (): Promise<SettingsEntity> => {
                const entity = await this.settings.orderBy('id').last();

                if (!entity) {
                    return defaultSettings;
                }

                return { ...entity, id: undefined };
            }),
            { initialValue: defaultSettings },
        );
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
