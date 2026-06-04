import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';
import Sidebar from '../components/Sidebar';
import { useLocation } from 'react-router-dom';

function TeacherPanel() {
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [lateMinutes, setLateMinutes] = useState({});
  const [notes, setNotes] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saved, setSaved] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const activeTab = location.pathname === '/teacher/groups' ? 'groups' :
                    location.pathname === '/teacher/schedule' ? 'schedule' : 'attendance';

  const token = localStorage.getItem('token');
  const userId = parseInt(localStorage.getItem('user_id'));
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/users/`, { headers }).then(res => {
      const user = res.data.find(u => u.id === userId);
      if (user) setTeacherInfo(user);
    });
    axios.get(`${API}/groups/`, { headers }).then(res => {
      setGroups(res.data.filter(g => g.teacher === userId));
    });
    axios.get(`${API}/students/`, { headers }).then(res => {
      setAllStudents(res.data);
    });
  }, [userId]);

  useEffect(() => {
    if (selectedGroup) {
      setStudents(allStudents.filter(s => s.group == selectedGroup));
    }
  }, [selectedGroup, allStudents]);

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
      <Sidebar
        active={activeTab}
        role="teacher"
        userName={teacherInfo ? `${teacherInfo.first_name} ${teacherInfo.last_name}` : 'Муаллим'}
      />

      <div className="flex-1 flex flex-col overflow-hidden mt-14 lg:mt-0">
        <div className="bg-white border-b px-4 lg:px-6 py-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-800">
                {activeTab === 'attendance' && 'Давомот'}
                {activeTab === 'groups' && 'Гурӯҳҳои ман'}
                {activeTab === 'schedule' && 'Расписание'}
              </h1>
              <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-200">🎓 Муаллим</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">📅 {new Date().toLocaleDateString()}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 border shadow-sm text-center">
              <div className="text-xs text-gray-400">Гурӯҳҳо</div>
              <div className="text-xl font-bold text-gray-800">{groups.length}</div>
              <div className="text-lg">📚</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm text-center">
              <div className="text-xs text-gray-400">Хонандагон</div>
              <div className="text-xl font-bold text-gray-800">
                {allStudents.filter(s => groups.some(g => g.id === s.group)).length}
              </div>
              <div className="text-lg">👥</div>
            </div>
            <div className="bg-white rounded-xl p-3 border shadow-sm text-center">
              <div className="text-xs text-gray-400">Имрӯз</div>
              <div className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString()}</div>
              <div className="text-lg">📅</div>
            </div>
          </div>

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div>
              <div className="bg-white rounded-xl border shadow-sm p-3 mb-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Гурӯҳ *</label>
                    <select value={selectedGroup}
                      onChange={e => { setSelectedGroup(e.target.value); setAttendance({}); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                      <option value="">Интихоб кунед</option>
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

              {selectedGroup && students.length > 0 && (
                <div className="space-y-2 mb-4">
                  {students.map((s) => (
                    <div key={s.id} className={`bg-white rounded-xl border shadow-sm p-3 ${attendance[s.id] === 'absent' ? 'border-red-200 bg-red-50' : attendance[s.id] === 'late' ? 'border-orange-200 bg-orange-50' : ''}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{s.first_name[0]}</div>
                        <div className="text-sm font-medium">{s.first_name} {s.last_name}</div>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name={`t-${s.id}`}
                            checked={attendance[s.id] === 'present' || !attendance[s.id]}
                            onChange={() => setAttendance(p => ({...p, [s.id]: 'present'}))}
                            className="accent-green-500" />
                          <span className="text-xs text-green-600">Омад</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name={`t-${s.id}`}
                            checked={attendance[s.id] === 'absent'}
                            onChange={() => setAttendance(p => ({...p, [s.id]: 'absent'}))}
                            className="accent-red-500" />
                          <span className="text-xs text-red-500">Наомад</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" name={`t-${s.id}`}
                            checked={attendance[s.id] === 'late'}
                            onChange={() => setAttendance(p => ({...p, [s.id]: 'late'}))}
                            className="accent-orange-400" />
                          <span className="text-xs text-orange-500">Дер</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!selectedGroup && (
                <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <div className="text-gray-500">Аввал гурӯҳро интихоб кунед</div>
                </div>
              )}

              {selectedGroup && students.length === 0 && (
                <div className="bg-white rounded-xl border shadow-sm p-6 text-center text-gray-400">
                  Ин гурӯҳда хонанда нест
                </div>
              )}

              {selectedGroup && students.length > 0 && (
                <div className="flex justify-end gap-2">
                  <button onClick={() => setAttendance({})} className="border text-gray-600 px-4 py-2 rounded-lg text-sm">Бекор</button>
                  <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">💾 Сабт</button>
                </div>
              )}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div>
              {groups.length === 0 ? (
                <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <div className="text-gray-500">Гурӯҳ нест</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map(g => (
                    <div key={g.id} className="bg-white rounded-xl border shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            {g.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{g.name}</div>
                            <div className="text-xs text-gray-400">{g.subject}</div>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {g.is_active ? 'Фаъол' : 'Тавақкуф'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div>⏰ {g.schedule || 'Вақт нест'}</div>
                        <div>🚪 {g.room || '-'}</div>
                        <div>👥 {allStudents.filter(s => s.group === g.id).length} хонанда</div>
                        <div>💰 {g.price} с./моҳ</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              {groups.length === 0 ? (
                <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
                  <div className="text-4xl mb-3">📅</div>
                  <div className="text-gray-500">Расписание нест</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map(g => (
                    <div key={g.id} className="bg-white rounded-xl border shadow-sm p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {g.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{g.name}</div>
                          <div className="text-sm text-gray-500">{g.subject}</div>
                          <div className="text-sm font-medium text-blue-600 mt-1">⏰ {g.schedule || 'Вақт нест'}</div>
                        </div>
                        <div className="text-right text-xs text-gray-400">
                          <div>{allStudents.filter(s => s.group === g.id).length} нафар</div>
                          <div>Кабинет: {g.room || '-'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

export default TeacherPanel;