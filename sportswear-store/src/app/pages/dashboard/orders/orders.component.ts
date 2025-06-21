import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderService, Order } from '../../../services/order.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders$: Observable<Order[]>;
  displayedColumns: string[] = [
    'id',
    'userEmail',
    'total',
    'status',
    'createdAt',
    'actions',
  ];

  constructor(private orderService: OrderService) {
    this.orders$ = this.orderService.getAllOrders();
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: Order['status']
  ): Promise<void> {
    try {
      await this.orderService.updateOrderStatus(orderId, newStatus);
      // Refresh the orders list
      this.orders$ = this.orderService.getAllOrders();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Error updating order status. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  }

  getStatusColor(status: Order['status']): string {
    switch (status) {
      case 'pending':
        return 'warn';
      case 'processing':
        return 'accent';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'primary';
      case 'cancelled':
        return 'warn';
      default:
        return 'primary';
    }
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    const timestamp = date.toDate ? date.toDate() : new Date(date);
    return (
      timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString()
    );
  }

  getOrderItemsCount(items: any[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  // Helper methods for summary cards
  getPendingOrdersCount(orders: Order[]): number {
    return orders.filter((o) => o.status === 'pending').length;
  }

  getProcessingOrdersCount(orders: Order[]): number {
    return orders.filter((o) => o.status === 'processing').length;
  }

  getDeliveredOrdersCount(orders: Order[]): number {
    return orders.filter((o) => o.status === 'delivered').length;
  }

  // Helper method for image error handling
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}
