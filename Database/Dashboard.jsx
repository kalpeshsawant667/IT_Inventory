import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Package, UserCheck, Wrench, BarChart3, Settings, 
  Search, Plus, X, Trash2, Edit3, CheckCircle2, ChevronRight, Download, AlertCircle 
} from 'lucide-react';

// --- INITIAL SEED DATA ---
const INITIAL_DATA = {
  categories: ["Laptops", "Monitors", "Mobile Devices", "Networking", "Peripherals", "Servers"],
  locations: ["HQ - Floor 3", "HQ - Floor 4", "Warehouse A", "Remote / Field", "Data Center"],
  users: [
    { id: "u_1", name: "Maya Chen", email: "maya.chen@company.com", department: "Engineering" },
    { id: "u_2", name: "Diego Ferreira", email: "diego.f@company.com", department: "Sales" },
    { id: "u_3", name: "Priya Nair", email: "priya.nair@company.com", department: "Finance" }
  ],
  assets: [
    { id: "a_1", tag: "IT-LAP-00123", name: "Dell Latitude 7440", category: "Laptops", manufacturer: "Dell", model: "7440", serial: "DL-88213", purchaseDate: "2024-02-10", warranty: "2025-02-10", cost: 1450, location: "HQ - Floor 3", status: "Assigned", assignedTo: "u_1", history: [] },
    { id: "a_2", tag: "IT-LAP-00124", name: "MacBook Pro 14\"", category: "Laptops", manufacturer: "Apple", model: "M3 Pro", serial: "C02FX2Q1", purchaseDate: "2023-11-02", warranty: "2024-11-02", cost: 2399, location: "HQ - Floor 4", status: "Available", assignedTo: null, history: [] },
    { id: "a_6", tag: "IT-LAP-00131", name: "ThinkPad X1 Carbon", category: "Laptops", manufacturer: "Lenovo", model: "Gen 11", serial: "PF3X0091", purchaseDate: "2024-01-20", warranty: "2025-01-20", cost: 1699, location: "HQ - Floor 3", status: "In Repair", assignedTo: "u_3", history: [] },
  ],
  assignments: [
    { id: "as_1", assetId: "a_1", userId: "u_1", date: "2024-02-14", status: "Active" }
  ],
  maintenance: [
    { id: "m_1", assetId: "a_6", type: "Repair", desc: "Screen flicker panel replacement", date: "2024-08-15", status: "Scheduled" }
  ],
  activity: [{ id: 1, text: "System initialized", ts: new Date().toISOString() }]
};

const App = () => {
  // --- STATE ---
  const [view, setView] = useState('dashboard');
  const [assets, setAssets] = useState(INITIAL_DATA.assets);
  const [activity, setActivity] = useState(INITIAL_DATA.activity);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // --- HELPERS ---
  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts([...toasts, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const logActivity = (text) => {
    setActivity(prev => [{ id: Date.now(), text, ts: new Date().toISOString() }, ...prev].slice(0, 20));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'text-emerald-400 bg-emerald-400/10',
      'Assigned': 'text-blue-400 bg-blue-400/10',
      'In Repair': 'text-orange-400 bg-orange-400/10',
      'Retired': 'text-slate-400 bg-slate-400/10',
      'Disposed': 'text-red-400 bg-red-400/10'
    };
    return colors[status] || colors['Available'];
  };

  // --- FILTERED DATA ---
  const filteredAssets = useMemo(() => {
    return assets.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) || 
      a.tag.toLowerCase().includes(search.toLowerCase()) ||
      a.serial.toLowerCase().includes(search.toLowerCase())
    );
  }, [assets, search]);

  // --- COMPONENTS ---

  const AssetTag = ({ tag }) => (
    <div className="inline-flex items-center bg-[#182130] border border-[#26313F] rounded overflow-hidden font-mono text-[11px]">
      <div className="flex gap-[1px] px-1.5 py-2 bg-black/40 border-r border-[#26313F]">
        <div className="w-[1.5px] h-3 bg-[#22E6AC]" />
        <div className="w-[1.5px] h-3 bg-[#22E6AC]" />
        <div className="w-[1.5px] h-3 bg-[#22E6AC]" />
      </div>
      <span className="px-2 text-slate-200">{tag}</span>
    </div>
  );

  const SidebarItem = ({ id, label, icon: Icon, badge }) => (
    <button 
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
        view === id ? 'bg-[#22E6AC]/10 text-[#22E6AC]' : 'text-slate-400 hover:bg-[#182130] hover:text-slate-100'
      }`}
    >
      <Icon size={18} />
      <span className="flex-1 text-left">{label}</span>
      {badge && <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${view === id ? 'bg-[#22E6AC]/20' : 'bg-[#182130]'}`}>{badge}</span>}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-slate-200 font-sans selection:bg-[#22E6AC]/20 selection:text-[#22E6AC]">
      
      {/* Sidebar */}
      <aside className="w-60 bg-[#121822] border-r border-[#26313F] flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-[#26313F]">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-end gap-[2px] h-4">
              {[8, 14, 10, 16].map((h, i) => <div key={i} style={{ height: h }} className="w-1 bg-[#22E6AC]" />)}
            </div>
            <h1 className="font-bold tracking-tight text-slate-100">ASSET LEDGER</h1>
          </div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">IT Inventory Console</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <SidebarItem id="assets" label="Assets" icon={Package} badge={assets.length} />
          <SidebarItem id="assignments" label="Assignments" icon={UserCheck} badge={INITIAL_DATA.assignments.length} />
          <SidebarItem id="maintenance" label="Maintenance" icon={Wrench} badge={INITIAL_DATA.maintenance.length} />
          <SidebarItem id="reports" label="Reports" icon={BarChart3} />
          <SidebarItem id="settings" label="Settings" icon={Settings} />
        </nav>

        <div className="p-4 border-t border-[#26313F] text-[10px] font-mono text-slate-600">
          v1.0.0-react · Stable Release
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 bg-[#0B0F14]/80 backdrop-blur-md border-b border-[#26313F] sticky top-0 z-10 flex items-center px-8 gap-4">
          <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#22E6AC] transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search assets, tags, serials..."
              className="w-full bg-[#121822] border border-[#26313F] rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-[#22E6AC]/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1" />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#22E6AC] text-[#06231A] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#3EF2C0] transition-colors shadow-lg shadow-[#22E6AC]/10"
          >
            <Plus size={18} /> New Asset
          </button>
        </header>

        <div className="p-8">
          {view === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <header>
                <h2 className="text-2xl font-bold font-display text-slate-100">Dashboard</h2>
                <p className="text-slate-500 text-sm">Live snapshot of your IT asset fleet.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Assets", val: assets.length, sub: "Items tracked", col: "#22E6AC" },
                  { label: "Available", val: assets.filter(a => a.status === 'Available').length, sub: "Ready to deploy", col: "#22E6AC" },
                  { label: "Assigned", val: assets.filter(a => a.status === 'Assigned').length, sub: "Active checkouts", col: "#5B93FF" },
                  { label: "In Repair", val: assets.filter(a => a.status === 'In Repair').length, sub: "Work orders open", col: "#F5A93E" },
                ].map((kpi, i) => (
                  <div key={i} className="bg-[#121822] border border-[#26313F] p-5 rounded-xl relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: kpi.col }} />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{kpi.label}</span>
                    <div className="text-3xl font-bold text-slate-100 mt-1 font-display">{kpi.val}</div>
                    <div className="text-xs text-slate-500 mt-1">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#121822] border border-[#26313F] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Recent Inventory Activity</h3>
                  <div className="space-y-4">
                    {activity.map(act => (
                      <div key={act.id} className="flex gap-4 items-start group">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22E6AC] mt-1.5 group-hover:scale-150 transition-transform" />
                        <div>
                          <p className="text-sm text-slate-200">{act.text}</p>
                          <p className="text-[10px] font-mono text-slate-600 mt-0.5">{new Date(act.ts).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#121822] border border-[#26313F] rounded-xl p-6">
                  <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">System Health</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400">Database Sync</span>
                        <span className="text-[#22E6AC]">Optimal</span>
                      </div>
                      <div className="h-1.5 bg-[#182130] rounded-full overflow-hidden">
                        <div className="h-full bg-[#22E6AC] w-[94%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400">License Usage</span>
                        <span className="text-blue-400">82%</span>
                      </div>
                      <div className="h-1.5 bg-[#182130] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 w-[82%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'assets' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold font-display text-slate-100">Assets</h2>
                  <p className="text-slate-500 text-sm">Managing {filteredAssets.length} total items</p>
                </div>
              </header>

              <div className="bg-[#121822] border border-[#26313F] rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#182130] text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      <th className="px-6 py-4">Asset</th>
                      <th className="px-6 py-4">ID Tag</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#26313F]">
                    {filteredAssets.map(asset => (
                      <tr 
                        key={asset.id} 
                        className="hover:bg-[#182130]/50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedAsset(asset)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-200">{asset.name}</div>
                          <div className="text-[11px] text-slate-500">{asset.manufacturer} · {asset.model}</div>
                        </td>
                        <td className="px-6 py-4">
                          <AssetTag tag={asset.tag} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{asset.category}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{asset.location}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${getStatusColor(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-600 hover:text-slate-300 transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Drawer (Details) */}
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAsset(null)} />
            <div className="relative w-full max-w-lg bg-[#121822] border-l border-[#26313F] shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
              <div className="p-8 space-y-8">
                <header className="flex justify-between items-start">
                  <div>
                    <AssetTag tag={selectedAsset.tag} />
                    <h2 className="text-2xl font-bold mt-4 text-slate-100">{selectedAsset.name}</h2>
                  </div>
                  <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-[#182130] rounded-full text-slate-500 hover:text-slate-200 transition-colors">
                    <X size={20} />
                  </button>
                </header>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Status", val: selectedAsset.status },
                    { label: "Serial Number", val: selectedAsset.serial, mono: true },
                    { label: "Category", val: selectedAsset.category },
                    { label: "Location", val: selectedAsset.location },
                    { label: "Purchase Date", val: selectedAsset.purchaseDate },
                    { label: "Warranty Expiry", val: selectedAsset.warranty },
                    { label: "Replacement Value", val: `$${selectedAsset.cost.toLocaleString()}` }
                  ].map((d, i) => (
                    <div key={i}>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">{d.label}</label>
                      <div className={`text-sm ${d.mono ? 'font-mono text-blue-400' : 'text-slate-200'}`}>{d.val}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-[#26313F]">
                  <h3 className="text-[10px] uppercase font-bold text-slate-500 mb-4">Management Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#182130] border border-[#26313F] rounded-lg text-sm hover:border-slate-500 transition-all">
                      <Edit3 size={16} /> Edit
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#182130] border border-[#26313F] rounded-lg text-sm hover:border-slate-500 transition-all">
                      <UserCheck size={16} /> Assign
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-all">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal (New Asset) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-xl bg-[#121822] border border-[#26313F] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-[#26313F] flex justify-between items-center bg-[#182130]/50">
                <h3 className="text-lg font-bold">Register New Asset</h3>
                <X size={20} className="cursor-pointer text-slate-500" onClick={() => setIsModalOpen(false)} />
              </div>
              <div className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Asset Name</label>
                    <input type="text" className="w-full bg-[#182130] border border-[#26313F] rounded-lg px-4 py-2 outline-none focus:border-[#22E6AC]/50" placeholder="e.g. Dell Latitude" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Asset Tag</label>
                    <input type="text" className="w-full bg-[#182130] border border-[#26313F] rounded-lg px-4 py-2 outline-none font-mono" defaultValue="IT-LAP-XXXXX" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Serial Number</label>
                  <input type="text" className="w-full bg-[#182130] border border-[#26313F] rounded-lg px-4 py-2 outline-none" placeholder="SN-00000000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Category</label>
                    <select className="w-full bg-[#182130] border border-[#26313F] rounded-lg px-4 py-2 outline-none">
                      {INITIAL_DATA.categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Purchase Price (USD)</label>
                    <input type="number" className="w-full bg-[#182130] border border-[#26313F] rounded-lg px-4 py-2 outline-none" defaultValue="0.00" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[#26313F] flex justify-end gap-3 bg-[#182130]/30">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-semibold hover:text-white transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    addToast("Asset successfully registered");
                    logActivity("New asset 'Mac Studio' registered");
                  }}
                  className="px-6 py-2 bg-[#22E6AC] text-[#06231A] rounded-lg text-sm font-bold shadow-lg shadow-[#22E6AC]/10"
                >
                  Create Asset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toasts */}
        <div className="fixed bottom-8 right-8 space-y-2 z-[100]">
          {toasts.map(t => (
            <div key={t.id} className="bg-[#182130] border border-[#26313F] border-l-4 border-l-[#22E6AC] p-4 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
              <CheckCircle2 size={18} className="text-[#22E6AC]" />
              <span className="text-sm font-medium">{t.msg}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default App;