import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hours',
  standalone: true,
  imports: [CommonModule],
  template: `
      <table>
          <tbody>
          <tr *ngFor="let hour of hoursArray()">
              <td>{{ hour }}</td>
          </tr>
          </tbody>
      </table>
  `,
  styles: [`
      table {
          width: 100%;
          border-collapse: collapse;
          font-family: Arial, sans-serif;
      }
      td {
          border: 1px solid rgba(0, 0, 0, 0.05); /* very soft border */
          padding: 8px 12px;
          text-align: center;
      }
      tr:nth-child(even) {
          background-color: rgba(0, 0, 0, 0.02); /* very light zebra striping */
      }
      tr:hover {
          background-color: rgba(0, 0, 0, 0.04); /* subtle hover */
      }
  `]
})
export class HoursComponent {
  // ✅ Required input
  hours = input.required<string>();

  // Split into array
  hoursArray = computed(() =>
    this.hours()
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  );
}
