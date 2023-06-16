import { bootstrapApplication } from '@angular/platform-browser';
import { KuwakaWakatiComponent } from './app/components/kuwaka-wakati/kuwaka-wakati.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/components/kuwaka-wakati/routes';
import { DATABASE_TABLE, databaseInitializerFactory, databaseInitializerFactoryDeps } from './app/services/database/database.service';
import { TimeTable } from './app/services/time-tracking/time.table';
import { APP_INITIALIZER } from '@angular/core';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { Settings } from 'luxon';
import { SettingsTable } from './app/services/settings/settings.table';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TauriService, tauriServiceFactory } from './app/services/tauri.service';

Settings.defaultLocale = 'de-DE';
registerLocaleData(localeDe);

bootstrapApplication(KuwakaWakatiComponent, {
    providers: [
        provideAnimations(),
        provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
        TimeTable,
        SettingsTable,
        { provide: TauriService, useFactory: tauriServiceFactory },
        { provide: DATABASE_TABLE, useExisting: TimeTable, multi: true },
        { provide: DATABASE_TABLE, useExisting: SettingsTable, multi: true },
        { provide: APP_INITIALIZER, useFactory: databaseInitializerFactory, deps: databaseInitializerFactoryDeps, multi: true },
    ],
}).catch(console.log);
