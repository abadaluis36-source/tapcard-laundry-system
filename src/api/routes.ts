import { Router } from 'express';
import { db } from '../db/index.js';
import { eq, desc, sql } from 'drizzle-orm';
import * as schema from '../db/schema.js';

import { processSyncPayload } from '../db/sync.js';

const router = Router();

// --- Tickets ---
router.get('/tickets', async (req, res) => {
  const allTickets = await db.select().from(schema.tickets).orderBy(desc(schema.tickets.createdAt));
  res.json(allTickets);
});

router.post('/tickets', async (req, res) => {
  try {
    const newTicket = await db.insert(schema.tickets).values(req.body).returning();
    res.json(newTicket[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tickets/:id', async (req, res) => {
  try {
    const updated = await db.update(schema.tickets).set(req.body).where(eq(schema.tickets.id, req.params.id)).returning();
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Customers ---
router.get('/customers', async (req, res) => {
  const all = await db.select().from(schema.customers).orderBy(desc(schema.customers.createdAt));
  res.json(all);
});

router.post('/customers', async (req, res) => {
  try {
    const newRecord = await db.insert(schema.customers).values(req.body).returning();
    res.json(newRecord[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/customers/:id', async (req, res) => {
  try {
    const updated = await db.update(schema.customers).set(req.body).where(eq(schema.customers.id, req.params.id)).returning();
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Services ---
router.get('/services', async (req, res) => {
  const all = await db.select().from(schema.services);
  res.json(all);
});

router.post('/services', async (req, res) => {
  try {
    const newRecord = await db.insert(schema.services).values(req.body).returning();
    res.json(newRecord[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const updated = await db.update(schema.services).set(req.body).where(eq(schema.services.id, req.params.id)).returning();
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await db.delete(schema.services).where(eq(schema.services.id, req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Expenses ---
router.get('/expenses', async (req, res) => {
  const all = await db.select().from(schema.expenses).orderBy(desc(schema.expenses.date));
  res.json(all);
});

router.post('/expenses', async (req, res) => {
  try {
    const newRecord = await db.insert(schema.expenses).values(req.body).returning();
    res.json(newRecord[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Users ---
router.get('/users', async (req, res) => {
  const all = await db.select().from(schema.users);
  res.json(all);
});

router.post('/users', async (req, res) => {
  try {
    const newRecord = await db.insert(schema.users).values(req.body).returning();
    res.json(newRecord[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Sync Load ---
router.get('/sync-load', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    const allTickets = await db.select().from(schema.tickets);
    const allCustomers = await db.select().from(schema.customers);
    const allExpenses = await db.select().from(schema.expenses);
    const allPayments = await db.select().from(schema.payments);
    const allServices = await db.select().from(schema.services);
    const allInventory = await db.select().from(schema.inventory);
    const allUsers = await db.select().from(schema.users);
    const allSettings = await db.select().from(schema.settings);
    
    res.json({
      tickets: allTickets,
      customers: allCustomers,
      expenses: allExpenses,
      payments: allPayments,
      services: allServices,
      inventory: allInventory,
      users: allUsers,
      settings: allSettings
    });
  } catch (err: any) {
    console.error('Sync Load Error:', err);
    res.status(500).json({ error: err.message });
  }
});
router.post('/sync', async (req, res) => {
  try {
    await processSyncPayload(req.body);
    // Simplification for MVP: just respond OK.
    res.json({ success: true });
  } catch (err: any) {
    console.error('Sync Error:', err);
    res.status(500).json({ error: err.message });
  }
});
router.get('/settings/:id', async (req, res) => {
  const record = await db.select().from(schema.settings).where(eq(schema.settings.id, req.params.id));
  if (record.length > 0) res.json(record[0]);
  else res.json(null);
});

router.put('/settings/:id', async (req, res) => {
  try {
    const existing = await db.select().from(schema.settings).where(eq(schema.settings.id, req.params.id));
    if (existing.length > 0) {
      const updated = await db.update(schema.settings).set(req.body).where(eq(schema.settings.id, req.params.id)).returning();
      res.json(updated[0]);
    } else {
      const inserted = await db.insert(schema.settings).values({ id: req.params.id, ...req.body }).returning();
      res.json(inserted[0]);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
