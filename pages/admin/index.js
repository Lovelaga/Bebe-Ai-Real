// pages/admin/index.js
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Expect client to have stored idToken in localStorage after login
        const token = typeof window !== 'undefined' ? localStorage.getItem('bebe_id_token') : null;
        if (!token) return setLoading(false);

        const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return setLoading(false);

        const data = await res.json();
        setUser(data.user);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return (
    <div className="p-6">
      <h2>Admin Console</h2>
      <p>Please login first (client-side Firebase auth). After login, store the idToken in localStorage as <code>bebe_id_token</code>.</p>
    </div>
  );

  if (user.role !== 'admin') return (
    <div className="p-6">
      <h2>Access denied</h2>
      <p>Your account does not have admin privileges.</p>
    </div>
  );

  return (
    <div className="p-6">
      <h1>🔥 Bebe AI — Master Command Center</h1>
      <p>Welcome, {user.displayName || user.email} (Admin)</p>

      <section style={{ marginTop: 20 }}>
        <h3>Quick Controls</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <button>Upload Update</button>
          <button>Trigger Auto-Upgrade</button>
          <button>Backup Now</button>
          <button>View Activity Logs</button>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Command Console</h3>
        <textarea id="admin-command" rows={6} style={{ width: '100%' }} placeholder="Type commands for Bebe AI here..."></textarea>
        <div style={{ marginTop: 8 }}>
          <button id="run-command">Run Command</button>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>System Status</h3>
        <pre id="system-status">All systems nominal.</pre>
      </section>
    </div>
  );
}
