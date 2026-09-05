fetch('http://localhost:3000/api/sync-load')
  .then(res => res.json())
  .then(async data => {
      // Simulate frontend payload
      const payload = {
         tickets: data.tickets || [],
         customers: data.customers || [],
         expenses: data.expenses || [],
         payments: data.payments || [],
         services: data.services || [],
         inventory: data.inventory || [],
         users: data.users || [],
         settings: data.settings || []
      };
      
      // Add a test ticket
      payload.tickets.push({
         id: 'tkt-test-1',
         ticketNumber: 'TEST1',
         customerId: 'cust-1',
         customerName: 'Test',
         customerPhone: '123',
         items: [],
         totalWeightKg: 1,
         bagCount: 1,
         totalAmount: 1,
         amountPaid: 0,
         paymentStatus: 'UNPAID',
         paymentMethod: 'CASH',
         status: 'RECEIVED',
         statusHistory: [],
         notes: '',
         detergentOption: '',
         fragranceOption: '',
         createdAt: new Date().toISOString(),
         estimatedReadyAt: new Date().toISOString(),
         staffName: 'Admin'
      });

      const res = await fetch('http://localhost:3000/api/sync', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });
      const txt = await res.text();
      console.log('SYNC RES:', txt);
  }).catch(console.error);
