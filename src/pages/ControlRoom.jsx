import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Room3DWrapper } from '@/components/studio/Room3DWrapper';
import { ArrowLeft, Home, Cpu, Radio, Activity, Zap, Shield } from 'lucide-react';

const SYSTEMS = [
  { id: 'broadcast', label: 'Broadcast Engine', status: 'online', color: '#ff0033' },
  { id: 'chain', label: 'DOGECHAIN Node', status: 'online', color: '#00ffff' },
  { id: 'hermes', label: 'Hermes Engine', status: 'standby', color: '#ffff00' },
  { id: 'vault', label: 'Neon Vault', status: 'online', color: '#00ff88' },
  { id: 'mint', label: 'Mint Protocol', status: 'standby', color: '#ff00ff' },
  { id: 'signal', label: 'Signal Router', status: 'online', color: '#ff8800' },
];

const STATUS_COLORS = { online: '#00ff88', standby: '#ffff00', offline: '#ff0033' };

export default function ControlRoom() {
  const [activeSystem, setActiveSystem] = useState(null);
  const [logs, setLogs] = useState([
    { time: '00:00:01', msg: 'VSS-33.3 Control Room initialized', type: 'info' },
    { time: '00:00:02', msg: 'DOGECHAIN node sync: 100%', type: 'success' },
    { time: '00:00:03', msg: 'Broadcast engine: LIVE', type: 'success' },
    { time: '00:00:04', msg: 'Hermes Engine: awaiting API key', type: 'warn' },
  ]);

  const runCommand = (system) => {
    setActiveSystem(system.id);
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      msg: `Executing command on ${system.label}...`,
      type: 'info',
    }]);
    setTimeout(() => {
      setLogs(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        msg: `${system.label}: command acknowledged`,
        type: 'success',
      }]);
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      <Room3DWrapper room="control-room" opacity={0.2} />

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Link to={createPageUrl('VirtualSignalStudio')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '13px', fontFamily: 'monospace' }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}><Home size={14} /></Link>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '10px', color: '#ff00ff', letterSpacing: '0.15em' }}>CONTROL ROOM — SYNDICATE</span>
      </div>

      <div style={{ paddingTop: '60px', maxWidth: '900px', margin: '0 auto', padding: '80px 20px 80px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cpu size={20} style={{ color: '#ff00ff' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace' }}>Control Room</h1>
          </div>
          <p style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>System command center — monitor and control all VSS-33.3 infrastructure</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {SYSTEMS.map(sys => (
            <div
              key={sys.id}
              onClick={() => runCommand(sys)}
              style={{
                padding: '16px', borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${activeSystem === sys.id ? sys.color : '#1a1a1a'}`,
                background: activeSystem === sys.id ? `${sys.color}08` : '#0a0a0a',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: sys.color }}>{sys.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLORS[sys.status], animation: sys.status === 'online' ? 'pulse 2s infinite' : 'none' }} />
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: STATUS_COLORS[sys.status], letterSpacing: '0.1em' }}>{sys.status.toUpperCase()}</span>
                </div>
              </div>
              <div style={{ height: '3px', borderRadius: '2px', background: '#111', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: sys.status === 'online' ? '100%' : '40%', background: sys.color, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Console log */}
        <div style={{ padding: '16px', borderRadius: '8px', border: '1px solid #1a1a1a', background: '#050505' }}>
          <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={12} /> SYSTEM LOG
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '11px', fontFamily: 'monospace' }}>
                <span style={{ color: '#444', minWidth: '70px' }}>{log.time}</span>
                <span style={{ color: log.type === 'success' ? '#00ff88' : log.type === 'warn' ? '#ffff00' : '#aaa' }}>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link to={createPageUrl('HermesEngine')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '4px',
            border: '1px solid #ffff0040', color: '#ffff00',
            fontSize: '11px', fontFamily: 'monospace', textDecoration: 'none',
          }}>
            <Zap size={12} /> Hermes Engine
          </Link>
          <Link to={createPageUrl('AccessGate')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '4px',
            border: '1px solid #ff003340', color: '#ff0033',
            fontSize: '11px', fontFamily: 'monospace', textDecoration: 'none',
          }}>
            <Shield size={12} /> Access Gate
          </Link>
        </div>
      </div>
    </div>
  );
}
