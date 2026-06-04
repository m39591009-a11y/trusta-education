import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const incomeData = [
  { name: '1 май', daromad: 8000, xarojot: 4000 },
  { name: '7 май', daromad: 15000, xarojot: 7000 },
  { name: '14 май', daromad: 20000, xarojot: 9000 },
  { name: '21 май', daromad: 25000, xarojot: 10000 },
  { name: '28 май', daromad: 28450, xarojot: 12350 },
];

const attendanceData = [
  { name: 'Омаданд', value: 115, color: '#22c55e' },
  { name: 'Наомаданд', value: 11, color: '#ef4444' },
  { name: 'Дер карданд', value: 16, color: '#f59e0b' },
];

function OwnerDashboard() {
  const [stats, setStats] = useState({ students: 0, groups: 0, teachers: 0, debtors: 0 });
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/students/`, { headers }).then(res => {
      setStats(prev => ({ ...prev, students: res.data.length }));
      setStudents(res.data.slice(0, 5));
      const debtors = res.data.filter(s => parseFloat(s.balance) < 0).length;
      setStats(prev => ({ ...prev, debtors }));
    });
    axios.get(`${API}/groups/`, { headers }).then(res => {
      setStats(prev => ({ ...prev, groups: res.data.length }));
    });
    axios.get(`${API}/users/`, { headers }).then(res => {
      const teachers = res.data.filter(u => u.role === 'teacher').length;
      setStats(prev => ({ ...prev, teachers }));
    });
    axios.get(`${API}/payments/`, { headers }).then(res => {
      setPayments(res.data.slice(0, 5));
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="dashboard" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Панели асосӣ</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 lg:p-4 border shadow-sm">
              <div className="text-xs text-blue-600 font-medium mb-1">Хонандагон</div>
              <div className="text-2xl font-bold text-gray-800">{stats.students}</div>
              <div className="text-xl mt-1">👥</div>
            </div>
            <div className="bg-white rounded-xl p-3 lg:p-4 border shadow-sm">
              <div className="text-xs text-green-600 font-medium mb-1">Гурӯҳҳо</div>
              <div className="text-2xl font-bold text-gray-800">{stats.groups}</div>
              <div className="text-xl mt-1">📚</div>
            </div>
            <div className="bg-white rounded-xl p-3 lg:p-4 border shadow-sm">
              <div className="text-xs text-orange-600 font-medium mb-1">Деркардаҳо</div>
              <div className="text-2xl font-bold text-gray-800">16</div>
              <div className="text-xl mt-1">⏰</div>
            </div>
            <div className="bg-white rounded-xl p-3 lg:p-4 border shadow-sm">
              <div className="text-xs text-red-600 font-medium mb-1">Қарздорон</div>
              <div className="text-2xl font-bold text-gray-800">{stats.debtors}</div>
              <div className="text-xl mt-1">💸</div>
            </div>
            <div className="bg-white rounded-xl p-3 lg:p-4 border shadow-sm">
              <div className="text-xs text-purple-600 font-medium mb-1">Муаллимон</div>
              <div className="text-2xl font-bold text-gray-800">{stats.teachers}</div>
              <div className="text-xl mt-1">👨‍🏫</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            <div className="lg:col-span-2 bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-sm font-semibold text-gray-800 mb-2">Даромад ва харочот</div>
              <div className="flex gap-4 mb-3 text-xs">
                <div><div className="text-green-600">Даромад</div><div className="font-bold">28 450 с.</div></div>
                <div><div className="text-red-500">Харочот</div><div className="font-bold">12 350 с.</div></div>
                <div><div className="text-blue-600">Фоида</div><div className="font-bold">16 100 с.</div></div>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="daromad" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="xarojot" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-sm font-semibold text-gray-800 mb-2">Давомот</div>
              <div className="flex justify-center">
                <PieChart width={150} height={130}>
                  <Pie data={attendanceData} cx={70} cy={60} innerRadius={35} outerRadius={55} dataKey="value">
                    {attendanceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <div className="space-y-1">
                {attendanceData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }}></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-800">Қарздорон</div>
                <a href="/debtors" className="text-xs text-blue-500">Ҳама</a>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left pb-2">Ном</th>
                    <th className="text-right pb-2">Қарз</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => parseFloat(s.balance) < 0).slice(0, 5).map((s, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="py-1.5 text-gray-700">{s.first_name} {s.last_name}</td>
                      <td className="py-1.5 text-right text-red-500 font-medium">{Math.abs(s.balance)} с.</td>
                    </tr>
                  ))}
                  {students.filter(s => parseFloat(s.balance) < 0).length === 0 && (
                    <tr><td colSpan={2} className="py-3 text-center text-gray-400">Қарздор нест</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-800">Пардохтҳо</div>
                <a href="/payments" className="text-xs text-blue-500">Ҳама</a>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left pb-2">Сана</th>
                    <th className="text-right pb-2">Маблағ</th>
                    <th className="text-right pb-2">Тарз</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan={3} className="py-3 text-center text-gray-400">Пардохт нест</td></tr>
                  ) : payments.map((p, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      <td className="py-1.5 text-gray-400">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="py-1.5 text-right text-green-600 font-medium">{p.amount} с.</td>
                      <td className="py-1.5 text-right text-gray-500">{p.method === 'cash' ? 'Накд' : 'Перевод'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { label: 'Хонанда', icon: '👤', href: '/students' },
              { label: 'Гурӯҳ', icon: '📚', href: '/groups' },
              { label: 'Муаллим', icon: '👨‍🏫', href: '/teachers' },
              { label: 'Пардохт', icon: '💳', href: '/payments' },
              { label: 'Молия', icon: '💸', href: '/finance' },
              { label: 'Ҳисобот', icon: '📊', href: '/finance' },
            ].map((action, i) => (
              <a key={i} href={action.href}
                className="bg-white rounded-xl p-3 border shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all text-center">
                <div className="text-2xl mb-1">{action.icon}</div>
                <div className="text-xs text-blue-600 font-medium">{action.label}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;