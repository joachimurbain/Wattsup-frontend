import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { Theme } from '../theme';
import { TimeagoModule } from 'ngx-timeago';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { dateInterceptor } from './core/interceptors/date.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptors([dateInterceptor])),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimationsAsync(),
		providePrimeNG({
			theme: {
				preset: Theme,
				options: {
					cssLayer: {
						name: 'primeng',
						order: 'theme, base, primeng,tailwind',
					},
				},
			},
		}),
		importProvidersFrom(TimeagoModule.forRoot()),
	],
};
