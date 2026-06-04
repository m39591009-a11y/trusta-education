import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: '', first_name: '', last_name: '', phone: '', password: '', role: 'teacher'
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/users/`, { headers }).then(res => {
      setTeachers(res.data.filter(u => u.role === 'teacher'));
    });
  }, []);

  const filtered = teachers.filter(t =>
    `${t.first_name} ${t.last_name} ${t.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    try {
      await axios.post(`${API}/users/`, form, { headers });
      const res = await axios.get(`${API}/users/`, { headers });
      setTeachers(res.data.filter(u => u.role === 'teacher'));
      setShowModal(false);
      setForm({ username: '', first_name: '', last_name: '', phone: '', password: '', role: 'teacher' });
    } catch (e) {
      alert('Хато рӯй дод!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="teachers" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Муаллимон</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Ҳамаи муаллимон</div>
              <div className="text-2xl font-bold text-gray-800">{teachers.length}</div>
              <div className="text-xl mt-1">👨‍🏫</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Фаъол</div>
              <div className="text-2xl font-bold text-green-600">{teachers.length}</div>
              <div className="text-xl mt-1">✅</div>
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
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Муаллим</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Логин</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Телефон</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">Муаллим нест</td></tr>
                ) : filtered.map((t, i) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">
                          {t.first_name ? t.first_name[0] : t.username[0]}
                        </div>
                        <div className="text-sm font-medium text-gray-800">{t.first_name} {t.last_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.username}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.phone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Фаъол</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Муаллим нест</div>
            ) : filtered.map((t, i) => (
              <div key={t.id} className="bg-white rounded-xl border shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                      {t.first_name ? t.first_name[0] : t.username[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{t.first_name} {t.last_name}</div>
                      <div className="text-xs text-gray-400">{t.username}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Фаъол</span>
                </div>
                {t.phone && <div className="text-xs text-gray-400 mt-1 ml-11">📱 {t.phone}</div>}
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
              <h2 className="text-lg font-semibold">Иловаи муаллим</h2>
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
                <label className="text-xs text-gray-500 mb-1 block">Логин *</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Телефон</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Парол *</label>
                <input type="password" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
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

export default Teachers;