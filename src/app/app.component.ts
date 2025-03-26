import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import AdminNavComponent from './core/layout/nav/admin-nav.component';
import { BannerComponent } from './core/layout/banner/banner.component';
import { AuthService } from './core/auth/auth.service';


@Component({
	selector: 'app-root',
	imports: [RouterOutlet, AdminNavComponent, BannerComponent],
	template: `
	<div class="min-h-screen bg-surface-100">
		<app-banner />
		@switch (role()) {
			@case('admin'){
				<app-admin-nav class="  "/>
			}
		}
		<router-outlet />

	</div>

	`,
	styles: [``],
})
export class AppComponent {
	// private auth = inject(AuthService);
  role = computed(() => 'admin');
}
