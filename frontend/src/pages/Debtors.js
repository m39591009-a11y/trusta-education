import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';

function Debtors() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/students/`, { headers }).then(res => setStudents(res.data));
    axios.get(`${API}/groups/`, { headers }).then(res => setGroups(res.data));
  }, []);

  const debtors = students.filter(s => parseFloat(s.balance) < 0);
  const filtered = debtors.filter(s =>
    `${s.first_name} ${s.last_name} ${s.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const getGroupName = (groupId) => {
    const g = groups.find(g => g.id === groupId);
    return g ? g.name : '-';
  };

  const totalDebt = debtors.reduce((sum, s) => sum + Math.abs(parseFloat(s.balance || 0)), 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="debtors" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Қарздорон</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Қарздорон</div>
              <div className="text-2xl font-bold text-red-500">{debtors.length}</div>
              <div className="text-xl mt-1">👥</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm">
              <div className="text-xs text-gray-400">Умумии қарз</div>
              <div className="text-xl font-bold text-orange-500">{totalDebt.toLocaleString()} с.</div>
              <div className="text-xl mt-1">💸</div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl border shadow-sm p-3 mb-4">
            <input type="text" placeholder="Ҷустуҷӯ..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">№</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Ном ва насаб</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Гурӯҳ</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Телефон</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Қарз</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">Қарздор нест ✅</td></tr>
                ) : filtered.map((s, i) => (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold">{s.first_name[0]}</div>
                        <div className="text-sm font-medium text-gray-800">{s.first_name} {s.last_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getGroupName(s.group)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.phone}</td>
                    <td className="px-4 py-3 text-sm font-bold text-red-500">{Math.abs(parseFloat(s.balance)).toLocaleString()} с.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">Қарздор нест ✅</div>
            ) : filtered.map((s, i) => (
              <div key={s.id} className="bg-white rounded-xl border border-red-100 shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">{s.first_name[0]}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{s.first_name} {s.last_name}</div>
                      <div className="text-xs text-gray-400">{s.phone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-500">{Math.abs(parseFloat(s.balance)).toLocaleString()} с.</div>
                    <div className="text-xs text-gray-400">{getGroupName(s.group)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debtors;