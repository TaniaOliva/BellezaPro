import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  @Input() navLinks: NavLink[] = [];
  @Input() showAcceder: boolean = true;
  @Input() showUserAvatar: boolean = false;
}
