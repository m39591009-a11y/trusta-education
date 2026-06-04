import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', subject: '', teacher: '', schedule: '', room: '', price: '', is_active: true
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/groups/`, { headers }).then(res => setGroups(res.data));
    axios.get(`${API}/users/`, { headers }).then(res => {
      setTeachers(res.data.filter(u => u.role === 'teacher'));
    });
  }, []);

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      await axios.post(`${API}/groups/`, form, { headers });
      const res = await axios.get(`${API}/groups/`, { headers });
      setGroups(res.data);
      setShowModal(false);
      setForm({ name: '', subject: '', teacher: '', schedule: '', room: '', price: '', is_active: true });
    } catch (e) {
      alert('Хато рӯй дод!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="groups" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Гурӯҳҳо</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Ҳамаи гурӯҳҳо</div>
              <div className="text-2xl font-bold text-gray-800">{groups.length}</div>
              <div className="text-xl mt-1">📚</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Фаъол</div>
              <div className="text-2xl font-bold text-green-600">{groups.filter(g => g.is_active).length}</div>
              <div className="text-xl mt-1">✅</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Муаллимон</div>
              <div className="text-2xl font-bold text-gray-800">{teachers.length}</div>
              <div className="text-xl mt-1">👨‍🏫</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Давомот</div>
              <div className="text-2xl font-bold text-gray-800">87%</div>
              <div className="text-xl mt-1">📊</div>
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

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">№</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Номи гурӯҳ</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Фан</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Вақт</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Нарх</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">Гурӯҳ нест</td></tr>
                ) : filtered.map((g, i) => (
                  <tr key={g.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {g.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium text-blue-600">{g.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.schedule || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.price} с.</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {g.is_active ? 'Фаъол' : 'Тавақкуф'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Гурӯҳ нест</div>
            ) : filtered.map((g, i) => (
              <div key={g.id} className="bg-white rounded-xl border shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      {g.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-600">{g.name}</div>
                      <div className="text-xs text-gray-400">{g.subject}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {g.is_active ? 'Фаъол' : 'Тавақкуф'}
                  </span>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span>⏰ {g.schedule || '-'}</span>
                  <span>💰 {g.price} с.</span>
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
              <h2 className="text-lg font-semibold">Иловаи гурӯҳ</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Номи гурӯҳ *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Фан *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Муаллим</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})}>
                  <option value="">Интихоб кунед</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Вақт</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Дш, Ср, Ҷм 17:00-18:30"
                  value={form.schedule} onChange={e => setForm({...form, schedule: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Кабинет</label>
                  <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    value={form.room} onChange={e => setForm({...form, room: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Нарх (с.)</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
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

export default Groups;