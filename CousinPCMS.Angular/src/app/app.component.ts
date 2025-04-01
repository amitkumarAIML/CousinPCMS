import { Component } from '@angular/core';
import { HeaderComponent } from "./components/shared/header/header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cousins-root',
  imports: [HeaderComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cousins';
}
