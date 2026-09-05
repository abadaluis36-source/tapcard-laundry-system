import { db } from './index.js';
import * as schema from './schema.js';
import { sql } from 'drizzle-orm';

export async function processSyncPayload(payload: any) {
  const { tickets, customers, expenses, payments, services, inventory, users, settings } = payload;
  
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

  if (users && users.length > 0) {
    const safeUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      username: u.username || null,
      email: u.email || `${u.username || u.id}@tapcard.local`,
      role: u.role,
      staffCode: u.staffCode || 'STAFF',
      title: u.title || 'Staff',
      pin: u.pin || u.password || '1234',
      branch: u.branch || 'Main',
      avatarUrl: u.avatarUrl || null,
      shift: u.shift || null,
      status: u.status || 'ACTIVE'
    }));
    await db.insert(schema.users).values(safeUsers).onConflictDoUpdate({
      target: schema.users.id,
      set: {
        name: sql`EXCLUDED.name`,
        username: sql`EXCLUDED.username`,
        pin: sql`EXCLUDED.pin`,
        role: sql`EXCLUDED.role`,
        status: sql`EXCLUDED.status`,
        branch: sql`EXCLUDED.branch`,
        shift: sql`EXCLUDED.shift`,
        avatarUrl: sql`EXCLUDED.avatar_url`,
        staffCode: sql`EXCLUDED.staff_code`,
        title: sql`EXCLUDED.title`,
        email: sql`EXCLUDED.email`
      }
    });
  }

  if (settings && settings.length > 0) {
    const safeSettings = settings.map((s: any) => ({
      id: s.id,
      data: s.data !== undefined ? s.data : s
    }));
    await db.insert(schema.settings).values(safeSettings).onConflictDoUpdate({
      target: schema.settings.id,
      set: {
        data: sql`EXCLUDED.data`
      }
    });
  }
}
