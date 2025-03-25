import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import MenuComponent from './nav/nav.component';
import { BannerComponent } from './banner/banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, BannerComponent],
  template: `
    <div class="secondary text-white p-4">Tailwind test</div>

    <div class="main flex w-full h-full">
      <div class="test1"></div>
      <div class="test2"></div>
    </div>

    <!-- <app-banner /> -->
    <!-- 
    <app-menu />

    <router-outlet /> -->
  `,
  styles: [
    `
      .main {
        background-color: red;
      }
      .test1 {
        background-color: purple;
      }

      .test2 {
        background-color: green;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Wattsup';
}
