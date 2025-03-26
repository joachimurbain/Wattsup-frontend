import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-summary-card',
  imports: [Card,NgClass],
  template: `
<p-card class="text-center shadow-md">
  <div class="flex flex-col items-center justify-center p-4 gap-2">
    <div class="p-3 rounded-full text-2xl" [ngClass]="color()">
      <i class="pi" style="font-size: 2.5rem" [ngClass]="icon()"></i>
    </div>
    <div class="text-3xl font-bold">{{ value() }}</div>
    <div class="text-m font-medium text-gray-600">{{ label() }}</div>
  </div>
</p-card>
  `,
  styles: ``
})
export class SummaryCardComponent {
	icon = input.required<string>();
  label = input.required<string>();
	value = input.required<number>();
  color = input.required<string>() ;
}
