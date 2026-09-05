import React, { useEffect, useRef, useState } from 'react';
import { useLaundry } from '../context/LaundryContext';
import { io, Socket } from 'socket.io-client';

export const DBContextSync: React.FC = () => {
  const { 
    tickets, customers, expenses, payments, services, inventory,
    setTickets, setCustomers, setExpenses, setPayments, setServices, setInventory
  } = useLaundry();
  const isInitialLoad = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    // Initial load from DB
    fetch('/api/sync-load')
      .then(r => r.json())
      .then(data => {
        if (data.tickets && data.tickets.length > 0) {
          setTickets(data.tickets.map((t: any) => ({
            ...t,
            totalWeightKg: parseFloat(t.totalWeightKg),
            totalAmount: parseFloat(t.totalAmount),
            amountPaid: parseFloat(t.amountPaid),
          })));
        }
        if (data.customers && data.customers.length > 0) {
          setCustomers(data.customers.map((c: any) => ({
            ...c,
            totalSpent: parseFloat(c.totalSpent)
          })));
        }
        if (data.expenses && data.expenses.length > 0) {
          setExpenses(data.expenses.map((e: any) => ({
            ...e,
            amount: parseFloat(e.amount)
          })));
        }
        if (data.payments && data.payments.length > 0) {
          setPayments(data.payments.map((p: any) => ({
            ...p,
            amount: parseFloat(p.amount)
          })));
        }
        if (data.services && data.services.length > 0) {
          setServices(data.services.map((s: any) => ({
            ...s,
            price: parseFloat(s.price)
          })));
        }
        if (data.inventory && data.inventory.length > 0) {
          setInventory(data.inventory.map((i: any) => ({
            ...i,
            costPerUnit: parseFloat(i.costPerUnit)
          })));
        }
        setLoaded(true);
        isInitialLoad.current = false;
      })
      .catch(err => {
        console.error('Failed to load DB sync:', err);
        setLoaded(true);
        isInitialLoad.current = false;
      });

    // Setup Socket
    const socket = io();
    socketRef.current = socket;

    socket.on('pull-update', (data) => {
      isRemoteUpdate.current = true;
      
      if (data.tickets && data.tickets.length > 0) {
        setTickets(data.tickets.map((t: any) => ({
          ...t,
          totalWeightKg: parseFloat(t.totalWeightKg || 0),
          totalAmount: parseFloat(t.totalAmount || 0),
          amountPaid: parseFloat(t.amountPaid || 0),
        })));
      }
      if (data.customers && data.customers.length > 0) {
        setCustomers(data.customers.map((c: any) => ({
          ...c,
          totalSpent: parseFloat(c.totalSpent || 0)
        })));
      }
      if (data.expenses && data.expenses.length > 0) {
        setExpenses(data.expenses.map((e: any) => ({
          ...e,
          amount: parseFloat(e.amount || 0)
        })));
      }
      if (data.payments && data.payments.length > 0) {
        setPayments(data.payments.map((p: any) => ({
          ...p,
          amount: parseFloat(p.amount || 0)
        })));
      }
      if (data.services && data.services.length > 0) {
        setServices(data.services.map((s: any) => ({
          ...s,
          price: parseFloat(s.price || 0)
        })));
      }
      if (data.inventory && data.inventory.length > 0) {
        setInventory(data.inventory.map((i: any) => ({
          ...i,
          costPerUnit: parseFloat(i.costPerUnit || 0)
        })));
      }
      
      // Clear flag after a delay so the next useEffect doesn't push this back to the server
      setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 500);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isInitialLoad.current || !loaded) return;
    if (isRemoteUpdate.current) return;
    
    // Sync to DB on any change
    const syncTimeout = setTimeout(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('push-update', { tickets, customers, expenses, payments, services, inventory });
      } else {
        // Fallback if socket is down
        fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tickets, customers, expenses, payments, services, inventory })
        }).catch(console.error);
      }
    }, 1000); // Debounce sync by 1 second
    
    return () => clearTimeout(syncTimeout);
  }, [tickets, customers, expenses, payments, services, inventory, loaded]);

  return null;
}
