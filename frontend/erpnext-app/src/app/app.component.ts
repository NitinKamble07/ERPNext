import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <router-outlet></router-outlet>
    </div>
  </div>
  `
})
export class AppComponent {}