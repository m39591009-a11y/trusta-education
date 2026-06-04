import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', parent_phone: '', group: '', note: ''
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/students/`, { headers }).then(res => setStudents(res.data));
    axios.get(`${API}/groups/`, { headers }).then(res => setGroups(res.data));
  }, []);

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      await axios.post(`${API}/students/`, form, { headers });
      const res = await axios.get(`${API}/students/`, { headers });
      setStudents(res.data);
      setShowModal(false);
      setForm({ first_name: '', last_name: '', phone: '', parent_phone: '', group: '', note: '' });
    } catch (e) {
      alert('Хато рӯй дод!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="students" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Хонандагон</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Ҳамаи хонандагон</div>
              <div className="text-2xl font-bold text-gray-800">{students.length}</div>
              <div className="text-xl mt-1">👥</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Фаъол</div>
              <div className="text-2xl font-bold text-gray-800">{students.filter(s => s.status === 'active').length}</div>
              <div className="text-xl mt-1">✅</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Қарздорон</div>
              <div className="text-2xl font-bold text-red-500">{students.filter(s => parseFloat(s.balance) < 0).length}</div>
              <div className="text-xl mt-1">⚠️</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Гурӯҳҳо</div>
              <div className="text-2xl font-bold text-gray-800">{groups.length}</div>
              <div className="text-xl mt-1">📚</div>
            </div>
          </div>

          {/* Search + Add */}
          <div className="bg-white rounded-xl border shadow-sm p-3 mb-4">
            <div className="flex gap-2">
              <input type="text" placeholder="Ҷустуҷӯ..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              <button onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                + Илова
              </button>
            </div>
          </div>

          {/* Table — desktop */}
          <div className="hidden lg:block bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">№</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Ном ва насаб</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Телефон</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Гурӯҳ</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Статус</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Баланс</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">Хонанда нест</td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{s.first_name[0]}</div>
                        <div className="text-sm font-medium text-gray-800">{s.first_name} {s.last_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.group || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s.status === 'active' ? 'Фаъол' : 'Ғайрифаъол'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span className={parseFloat(s.balance) < 0 ? 'text-red-500' : 'text-green-600'}>{s.balance} с.</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="lg:hidden space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Хонанда нест</div>
            ) : filtered.map((s, i) => (
              <div key={s.id} className="bg-white rounded-xl border shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{s.first_name[0]}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{s.first_name} {s.last_name}</div>
                      <div className="text-xs text-gray-400">{s.phone}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${parseFloat(s.balance) < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {s.balance} с.
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {s.status === 'active' ? 'Фаъол' : 'Ғайрифаъол'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Иловаи хонанда</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Ном *</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Насаб *</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефон *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефони волидон</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.parent_phone} onChange={e => setForm({...form, parent_phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Гурӯҳ</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.group} onChange={e => setForm({...form, group: e.target.value})}>
                  <option value="">Интихоб кунед</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border text-gray-600 py-2 rounded-lg text-sm">Бекор</button>
              <button onClick={handleAdd}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">Илова</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;