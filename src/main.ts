import { bootstrapApplication } from '@angular/platform-browser';
import { KuwakaWakatiComponent } from './app/components/kuwaka-wakati/kuwaka-wakati.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/components/kuwaka-wakati/routes';
import { DATABASE_TABLE, databaseInitializerFactory, databaseInitializerFactoryDeps } from './app/services/database/database.service';
import { TimeTable } from './app/services/time-tracking/time.table';
import { APP_INITIALIZER } from '@angular/core';
import { setDefaultOptions } from 'date-fns';
import { de } from 'date-fns/locale';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeDe);
setDefaultOptions({ locale: de });

bootstrapApplication(KuwakaWakatiComponent, {
    providers: [
        provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
        TimeTable,
        { provide: DATABASE_TABLE, useExisting: TimeTable, multi: true },
        { provide: APP_INITIALIZER, useFactory: databaseInitializerFactory, deps: databaseInitializerFactoryDeps, multi: true },
    ],
}).catch(console.log);
