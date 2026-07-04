// pages/admin/index.js
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('All systems nominal.');
  const [command, setCommand] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileBase64, setFileBase64] = useState('');

  useEffect(() => {
    async function load() {
      try {
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

  async function loadLogs() {
    const token = localStorage.getItem('bebe_id_token');
    const res = await fetch('/api/admin/logs', { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { alert('Failed to load logs'); return; }
    const data = await res.json();
    setLogs(data.logs || []);
  }

  async function runCommand() {
    const token = localStorage.getItem('bebe_id_token');
    const res = await fetch('/api/admin/trigger-upgrade', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ command })
    });
    if (!res.ok) { alert('Command failed'); return; }
    alert('Command scheduled');
    setCommand('');
    loadLogs();
  }

  async function uploadFile() {
    if (!fileName || !fileBase64) { alert('Provide filename and a base64 file'); return; }
    const token = localStorage.getItem('bebe_id_token');
    const res = await fetch('/api/admin/upload', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename: fileName, contentBase64: fileBase64 })
    });
    if (!res.ok) { alert('Upload failed'); return; }
    const data = await res.json();
    alert('Uploaded: ' + JSON.stringify(data.result));
    setFileName(''); setFileBase64('');
    loadLogs();
  }

  function handleFileInput(e) {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      const b64 = ev.target.result.split(',')[1];
      setFileBase64(b64);
      setFileName(f.name);
    };
    reader.readAsDataURL(f);
  }

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
          <button onClick={() => { alert('Backup triggered'); }}>Backup Now</button>
          <button onClick={() => { setStatus('Triggering auto-upgrade...'); }}>Trigger Auto-Upgrade (preview)</button>
          <button onClick={() => { loadLogs(); }}>View Activity Logs</button>
          <button onClick={() => { alert('Deploy requested'); }}>Deploy Now</button>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Upload Update</h3>
        <input type="file" onChange={handleFileInput} />
        <div style={{ marginTop: 8 }}>
          <button onClick={uploadFile}>Upload File</button>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>Command Console</h3>
        <textarea value={command} onChange={(e) => setCommand(e.target.value)} rows={6} style={{ width: '100%' }} placeholder="Type commands for Bebe AI here..." />
        <div style={{ marginTop: 8 }}>
          <button onClick={runCommand}>Run Command</button>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>System Logs</h3>
        <div style={{ maxHeight: 300, overflow: 'auto', background: '#111', padding: 12 }}>
          {logs.length === 0 ? <div>No logs yet</div> : logs.map((l, i) => (
            <div key={l.id || i} style={{ borderBottom: '1px solid #222', padding: '8px 0' }}>
              <div style={{ fontSize: 12, color: '#aaa' }}>{l.timestamp || l.createdAt || ''}</div>
              <div>{l.action || l.raw || JSON.stringify(l)}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{JSON.stringify(l.details || l)}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h3>System Status</h3>
        <pre>{status}</pre>
      </section>

    </div>
  );
}
