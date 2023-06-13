import { bootstrapApplication } from '@angular/platform-browser';
import { KuwakaWakatiComponent } from './app/components/kuwaka-wakati/kuwaka-wakati.component';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/components/kuwaka-wakati/routes';

bootstrapApplication(KuwakaWakatiComponent, {
    providers: [provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' }))],
}).catch(console.log);
