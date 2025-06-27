'use client';

import Image from 'next/image';

const navItems = [
  {label: 'Home', icon: '🏠'},
  {label: 'Diagnosis', icon: '🩺'},
  {label: 'Appointments', icon: '📅'},
  {label: 'Medical Team', icon: '👩‍⚕️'},
  {label: 'Symptoms', icon: '💊'},
  {label: 'Lab Results', icon: '🧪'},
  {label: 'Medications', icon: '💊'},
  {label: 'Medical History', icon: '📖'},
  {label: 'Chatbot', icon: '🤖'},
];

const appointments = [
  {date: 'JUNE 22 2025', time: '2:00 PM', doctor: 'Dr. Timothy Kennard', type: 'General Practitioner'},
  {date: 'JUNE 22 2025', time: '2:00 PM', doctor: 'Dr. Timothy Kennard', type: 'General Practitioner'},
  {date: 'JUNE 22 2025', time: '2:00 PM', doctor: 'Dr. Timothy Kennard', type: 'General Practitioner'},
  {date: 'JUNE 22 2025', time: '2:00 PM', doctor: 'Dr. Timothy Kennard', type: 'General Practitioner'},
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <div className="text-lg font-semibold text-gray-500 px-8 py-4">Dashboard</div>
      <div className="flex-1 flex justify-center items-start">
        {/* Sidebar */}
        <aside className="bg-gray-900 text-white w-56 min-h-[700px] rounded-l-2xl flex flex-col py-6 px-3 gap-2">
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex items-center gap-2 border-t border-gray-700 pt-3">
            <span className="text-lg">🔍</span>
            <input
              className="bg-transparent outline-none text-sm flex-1"
              placeholder="Search"
              aria-label="Search"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-900 rounded-r-2xl p-6 grid grid-cols-12 gap-4 min-h-[700px]">
          {/* Profile & Stats */}
          <section className="col-span-4 flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="bg-black rounded-xl p-2 flex flex-col items-center w-40">
                <Image
                  src="/avatar.png"
                  alt="Beth Cartrette"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover"
                />
                <div className="bg-yellow-300 w-full text-center font-bold text-lg py-1 rounded-b-lg mt-2">
                  Jennifer BETH Cartrette
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2">
                  <div className="bg-yellow-300 rounded-lg px-3 py-1 font-bold text-sm">DOB</div>
                  <div className="bg-white rounded-lg px-3 py-1 text-sm flex-1">
                    <div>Sept 13 1982</div>
                    <div className="text-xs text-gray-500">Age: 43</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-yellow-300 rounded-lg px-3 py-1 font-bold text-sm">Height</div>
                  <div className="bg-white rounded-lg px-3 py-1 text-sm flex-1">
                    <div>5 ft 3 in</div>
                    <div className="text-xs text-gray-500">63 in</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-yellow-300 rounded-lg px-3 py-1 font-bold text-sm">Weight</div>
                  <div className="bg-white rounded-lg px-3 py-1 text-sm flex-1">150 lbs</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-orange-400 rounded-lg px-3 py-1 font-bold text-sm">Allergies</div>
              <div className="bg-white rounded-lg px-3 py-1 text-sm flex-1">Iodine</div>
            </div>
          </section>

          {/* Medications */}
          <section className="col-span-8">
            <div className="bg-cyan-300 rounded-t-lg px-4 py-2 font-bold text-lg">Current Medications</div>
            <div className="bg-white rounded-b-lg min-h-[100px] p-4"></div>
          </section>

          {/* Events */}
          <section className="col-span-6 flex gap-4">
            <div className="flex-1">
              <div className="bg-green-400 rounded-t-lg px-4 py-2 font-bold text-lg">Recent Events</div>
              <div className="bg-white rounded-b-lg min-h-[100px] p-4"></div>
            </div>
            <div className="flex-1">
              <div className="bg-green-400 rounded-t-lg px-4 py-2 font-bold text-lg">Upcoming Events</div>
              <div className="bg-white rounded-b-lg min-h-[100px] p-4"></div>
            </div>
          </section>

          {/* Appointments */}
          <section className="col-span-3 row-span-2 bg-pink-200 rounded-xl p-4 flex flex-col items-center">
            <div className="font-bold text-lg mb-2">Appointments</div>
            {/* Calendar placeholder */}
            <div className="bg-white rounded-lg p-2 mb-4 w-full">
              <div className="text-center font-semibold text-gray-700">March 2024</div>
              <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mt-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                {/* ...days... */}
              </div>
              {/* You can add a real calendar component here */}
            </div>
            <div className="flex-1 w-full space-y-2 overflow-y-auto">
              {appointments.map((appt, i) => (
                <div key={i} className="bg-pink-300 rounded-lg p-2 flex flex-col shadow">
                  <div className="text-xs text-gray-700 font-semibold">{appt.type}</div>
                  <div className="text-xs text-gray-600">{appt.doctor}</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{appt.date}</span>
                    <span>{appt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
} 