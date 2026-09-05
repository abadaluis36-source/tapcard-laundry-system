import { db } from './index.js';
import * as schema from './schema.js';
import { sql } from 'drizzle-orm';

export async function processSyncPayload(payload: any) {
  const { tickets, customers, expenses, payments, services, inventory } = payload;
  
  if (tickets && tickets.length > 0) {
    await db.insert(schema.tickets).values(tickets).onConflictDoUpdate({
      target: schema.tickets.id,
      set: {
        status: sql`EXCLUDED.status`,
        statusHistory: sql`EXCLUDED.status_history`,
        paymentStatus: sql`EXCLUDED.payment_status`,
        amountPaid: sql`EXCLUDED.amount_paid`,
        completedAt: sql`EXCLUDED.completed_at`,
        updatedAt: sql`EXCLUDED.updated_at`,
      }
    });
  }
  
  if (customers && customers.length > 0) {
    await db.insert(schema.customers).values(customers).onConflictDoUpdate({
      target: schema.customers.id,
      set: {
        totalOrders: sql`EXCLUDED.total_orders`,
        totalSpent: sql`EXCLUDED.total_spent`,
        lastOrderDate: sql`EXCLUDED.last_order_date`,
        activeTicketCount: sql`EXCLUDED.active_ticket_count`,
        isVip: sql`EXCLUDED.is_vip`,
        notes: sql`EXCLUDED.notes`,
      }
    });
  }
  
  if (expenses && expenses.length > 0) {
    await db.insert(schema.expenses).values(expenses).onConflictDoNothing();
  }
  
  if (payments && payments.length > 0) {
    await db.insert(schema.payments).values(payments).onConflictDoNothing();
  }
  
  if (services && services.length > 0) {
    await db.insert(schema.services).values(services).onConflictDoUpdate({
      target: schema.services.id,
      set: {
        isActive: sql`EXCLUDED.is_active`,
        price: sql`EXCLUDED.price`,
      }
    });
  }
  
  if (inventory && inventory.length > 0) {
    await db.insert(schema.inventory).values(inventory).onConflictDoUpdate({
      target: schema.inventory.id,
      set: {
        currentStock: sql`EXCLUDED.current_stock`,
        status: sql`EXCLUDED.status`,
        lastRestocked: sql`EXCLUDED.last_restocked`,
        costPerUnit: sql`EXCLUDED.cost_per_unit`,
      }
    });
  }
}
