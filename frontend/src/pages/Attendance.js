import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';

function Attendance() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [lateMinutes, setLateMinutes] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/groups/`, { headers }).then(res => setGroups(res.data));
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      axios.get(`${API}/students/`, { headers }).then(res => {
        setStudents(res.data.filter(s => s.group == selectedGroup));
      });
    }
  }, [selectedGroup]);

  const handleSave = async () => {
    try {
      for (const student of students) {
        const status = attendance[student.id] || 'present';
        await axios.post(`${API}/attendance/`, {
          student: student.id, group: selectedGroup, date: selectedDate,
          status, late_minutes: lateMinutes[student.id] || 0, note: notes[student.id] || '',
        }, { headers });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Хато! Давомот аллакай сабт шудааст.');
    }
  };

  const presentCount = students.filter(s => !attendance[s.id] || attendance[s.id] === 'present').length;
  const absentCount = students.filter(s => attendance[s.id] === 'absent').length;
  const lateCount = students.filter(s => attendance[s.id] === 'late').length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="attendance" role="owner" userName="Роҳбар" />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Давомот</h1>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Filters */}
          <div className="bg-white rounded-xl border shadow-sm p-3 mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Гурӯҳ *</label>
                <select value={selectedGroup}
                  onChange={e => { setSelectedGroup(e.target.value); setAttendance({}); }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">Гурӯҳро интихоб кунед</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Сана *</label>
                <input type="date" value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              {selectedGroup && students.length > 0 && (
                <div className="flex gap-2">
                  <div className="flex-1 bg-green-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-green-600">{presentCount}</div>
                    <div className="text-xs text-green-600">Омад</div>
                  </div>
                  <div className="flex-1 bg-red-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-red-500">{absentCount}</div>
                    <div className="text-xs text-red-500">Наомад</div>
                  </div>
                  <div className="flex-1 bg-orange-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-orange-500">{lateCount}</div>
                    <div className="text-xs text-orange-500">Дер</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          {selectedGroup && students.length > 0 && (
            <>
              <div className="hidden lg:block bg-white rounded-xl border shadow-sm overflow-hidden mb-4">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">№</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Ном ва насаб</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-green-600">Омад</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-red-500">Наомад</th>
                      <th className="text-center px-4 py-3 text-xs font-medium text-orange-500">Дер</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Шарҳ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id} className={`border-b ${attendance[s.id] === 'absent' ? 'bg-red-50' : attendance[s.id] === 'late' ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                        <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{s.first_name[0]}</div>
                            <div className="text-sm font-medium">{s.first_name} {s.last_name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="radio" name={`s-${s.id}`} checked={attendance[s.id] === 'present' || !attendance[s.id]} onChange={() => setAttendance(p => ({...p, [s.id]: 'present'}))} className="w-4 h-4 accent-green-500" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="radio" name={`s-${s.id}`} checked={attendance[s.id] === 'absent'} onChange={() => setAttendance(p => ({...p, [s.id]: 'absent'}))} className="w-4 h-4 accent-red-500" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="radio" name={`s-${s.id}`} checked={attendance[s.id] === 'late'} onChange={() => setAttendance(p => ({...p, [s.id]: 'late'}))} className="w-4 h-4 accent-orange-400" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" placeholder="Шарҳ..." value={notes[s.id] || ''} onChange={e => setNotes(p => ({...p, [s.id]: e.target.value}))} className="w-full border border-gray-100 rounded px-2 py-1 text-xs" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-2 mb-4">
                {students.map((s, i) => (
                  <div key={s.id} className={`bg-white rounded-xl border shadow-sm p-3 ${attendance[s.id] === 'absent' ? 'border-red-200 bg-red-50' : attendance[s.id] === 'late' ? 'border-orange-200 bg-orange-50' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{s.first_name[0]}</div>
                        <div className="text-sm font-medium">{s.first_name} {s.last_name}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name={`m-${s.id}`} checked={attendance[s.id] === 'present' || !attendance[s.id]} onChange={() => setAttendance(p => ({...p, [s.id]: 'present'}))} className="accent-green-500" />
                        <span className="text-xs text-green-600">Омад</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name={`m-${s.id}`} checked={attendance[s.id] === 'absent'} onChange={() => setAttendance(p => ({...p, [s.id]: 'absent'}))} className="accent-red-500" />
                        <span className="text-xs text-red-500">Наомад</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name={`m-${s.id}`} checked={attendance[s.id] === 'late'} onChange={() => setAttendance(p => ({...p, [s.id]: 'late'}))} className="accent-orange-400" />
                        <span className="text-xs text-orange-500">Дер кард</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setAttendance({})} className="border text-gray-600 px-4 py-2 rounded-lg text-sm">Бекор</button>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">💾 Сабт</button>
              </div>
            </>
          )}

          {!selectedGroup && (
            <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
              <div className="text-4xl mb-3">📚</div>
              <div className="text-gray-500">Аввал гурӯҳро интихоб кунед</div>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✅ Давомот сабт шуд!
        </div>
      )}
    </div>
  );
}

export default Attendance;