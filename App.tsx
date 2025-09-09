import React, { useEffect, useState, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { ShopPage } from './pages/ShopPage';
import { ClassroomPage } from './pages/ClassroomPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LoginPage } from './pages/LoginPage';
import { TutorDashboardPage, StudentDetailPage } from './pages/CoursesPage';
import { Icons, ProgressBar, Button, Card, Avatar } from './components/common';
import { ProfilePage } from './pages/ProfilePage';

const App: React.FC = () => {
  return (
    <UserProvider>
      <AuthGuard />
    </UserProvider>
  );
};

const AuthGuard: React.FC = () => {
  const { currentUser } = useUser();
  return (
    <HashRouter>
        {!currentUser && <LoginPage />}
        {currentUser && currentUser.role === 'student' && <StudentLayout />}
        {currentUser && currentUser.role === 'tutor' && <TutorLayout />}
    </HashRouter>
  );
}

// --- WELCOME MODAL ---
const WelcomeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <Card className="max-w-md text-center">
                <span className="text-7xl">👋</span>
                <h2 className="text-3xl font-extrabold text-white mt-4">Welcome to the League!</h2>
                <p className="text-slate-300 mt-2">
                    We're excited to have you. Complete quests, earn gems, and customize your avatar on your learning adventure!
                </p>
                <Button onClick={onClose} className="mt-6">
                    Let's Go!
                </Button>
            </Card>
        </div>
    )
}


// --- STUDENT LAYOUT ---

const StudentLayout: React.FC = () => {
    const { currentUser, dispatch, showWelcome, setShowWelcome } = useUser();

    useEffect(() => {
        if (!currentUser) return;

        // Auto-penalty check
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday = 0, Thursday = 4
        const isPenaltyTime = dayOfWeek >= 4; // Thursday or later

        if (isPenaltyTime && currentUser.weeklyXp < 10 && !currentUser.penaltyBox?.isActive) {
            dispatch({
                type: 'ACTIVATE_PENALTY',
                payload: {
                    studentId: currentUser.id,
                    reason: 'Low weekly engagement. Earn at least 10 XP this week.',
                    redemptionTask: 'Complete one quest to exit the Penalty Box.'
                }
            });
        }
    }, [currentUser, dispatch]);


    return (
        <div className="flex h-screen bg-black text-slate-200">
            {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
            <StudentSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/quests" element={<QuestsPage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/classroom" element={<ClassroomPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </main>
                <StudentBottomNav />
            </div>
        </div>
    );
}


const StudentSidebar: React.FC = () => {
  const { currentUser } = useUser();
  const isInPenaltyBox = currentUser?.penaltyBox?.isActive === true;

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-lg font-semibold ${
      isActive ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'
    }`;
  
  const shopNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-lg font-semibold ${
      isActive ? 'bg-yellow-500 text-black' : 'hover:bg-gray-800'
    } ${isInPenaltyBox ? 'opacity-50 pointer-events-none' : ''}`;


  return (
    <nav className="hidden md:flex flex-col w-64 bg-gray-900 p-4 border-r border-gray-700">
      <div className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <span className="text-yellow-400">The Learning</span>League
      </div>
      <div className="flex flex-col gap-2">
        <NavLink to="/" className={navLinkClasses}>
          {Icons.dashboard} Dashboard
        </NavLink>
        <NavLink to="/quests" className={navLinkClasses}>
          {Icons.courses} Quests
        </NavLink>
        <NavLink to="/classroom" className={navLinkClasses}>
          {Icons.classroom} Classroom
        </NavLink>
        <NavLink to="/leaderboard" className={navLinkClasses}>
          {Icons.leaderboard} Leaderboard
        </NavLink>
        <NavLink to="/shop" className={shopNavLinkClasses}>
          {Icons.shop} Shop
        </NavLink>
      </div>
      <div className="mt-auto text-center text-xs text-slate-500">
        <p>© 2025-2026 Mz. Marianna's Tutoring</p>
      </div>
    </nav>
  );
};

const StudentBottomNav: React.FC = () => {
    const { currentUser } = useUser();
    const isInPenaltyBox = currentUser?.penaltyBox?.isActive === true;

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center gap-1 transition-colors p-2 rounded-lg ${
        isActive ? 'text-yellow-400' : 'text-slate-400 hover:text-white'
        }`;

    const shopNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center gap-1 transition-colors p-2 rounded-lg ${
        isActive ? 'text-yellow-400' : 'text-slate-400 hover:text-white'
        } ${isInPenaltyBox ? 'opacity-50 pointer-events-none' : ''}`;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex justify-around py-2 z-40">
             <NavLink to="/" className={navLinkClasses}>
                {Icons.dashboard} <span className="text-xs">Dashboard</span>
            </NavLink>
            <NavLink to="/quests" className={navLinkClasses}>
                {Icons.courses} <span className="text-xs">Quests</span>
            </NavLink>
             <NavLink to="/classroom" className={navLinkClasses}>
                {Icons.classroom} <span className="text-xs">Classroom</span>
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkClasses}>
                {Icons.leaderboard} <span className="text-xs">Ranks</span>
            </NavLink>
            <NavLink to="/shop" className={shopNavLinkClasses}>
                {Icons.shop} <span className="text-xs">Shop</span>
            </NavLink>
        </nav>
    );
};


const Header: React.FC = () => {
  const { currentUser, xpToNextLevel, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;
  const isInPenaltyBox = currentUser?.penaltyBox?.isActive === true;

  return (
    <header className={`bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4 flex flex-wrap items-center justify-between gap-4 transition-shadow duration-500 ${isInPenaltyBox ? 'shadow-lg shadow-red-500/30' : ''}`}>
      <div className="w-full sm:w-auto">
         <h1 className="text-xl font-bold">Welcome back, {currentUser.name}!</h1>
         <p className="text-sm text-slate-400 hidden sm:block">Let's learn something new today.</p>
      </div>
      <div className="flex-grow flex items-center flex-wrap justify-end gap-x-4 gap-y-2">
         <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full" title={`${currentUser.loginStreak} day login streak!`}>
          <span className="text-xl">🔥</span>
          <span className="font-bold text-orange-400">{currentUser.loginStreak}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
          <span className="text-yellow-400 text-lg">💎</span>
          <span className="font-bold text-yellow-400">{currentUser.gems}</span>
        </div>
        <div className="w-full sm:w-48">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-yellow-400">Level {currentUser.level}</span>
            <span className="text-sm text-slate-400">{currentUser.xp} / {xpToNextLevel} XP</span>
          </div>
          <ProgressBar value={currentUser.xp} max={xpToNextLevel} colorClass="bg-yellow-500" />
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            aria-label="User menu"
          >
            <Avatar config={currentUser.avatar} size={48} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 animate-fade-in-fast">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400">Level {currentUser.level}</p>
                </div>
                <NavLink 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-slate-300 hover:bg-gray-700" 
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}>
                    My Profile
                </NavLink>
                <button 
                    onClick={() => { logout(); setIsDropdownOpen(false); }} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                    role="menuitem"
                >
                    Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


// --- TUTOR LAYOUT ---

const TutorLayout: React.FC = () => (
  <div className="flex h-screen bg-black text-slate-200">
    <TutorSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <TutorHeader />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<TutorDashboardPage />} />
          <Route path="/student/:studentId" element={<StudentDetailPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>
    </div>
  </div>
);

const TutorSidebar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-lg font-semibold ${
      isActive ? 'bg-teal-500 text-black' : 'hover:bg-gray-800'
    }`;

  return (
    <nav className="hidden md:flex flex-col w-64 bg-gray-900 p-4 border-r border-gray-700">
      <div className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <span className="text-teal-400">Tutor</span>Portal
      </div>
      <div className="flex flex-col gap-2">
        <NavLink to="/" className={navLinkClasses}>
          {Icons.dashboard} Dashboard
        </NavLink>
        <NavLink to="/leaderboard" className={navLinkClasses}>
          {Icons.leaderboard} Leaderboard
        </NavLink>
      </div>
       <div className="mt-auto text-center text-xs text-slate-500">
        <p>© 2025-2026 Mz. Marianna's Tutoring</p>
      </div>
    </nav>
  );
};

const TutorHeader: React.FC = () => {
  const { currentUser, logout } = useUser();
  if (!currentUser) return null;

  return (
     <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Tutor Dashboard</h1>
        <p className="text-sm text-slate-400">Welcome, {currentUser.name}!</p>
      </div>
      <div className="flex items-center gap-6">
        <Button onClick={logout} className="bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800 focus:ring-fuchsia-500">
            Logout
        </Button>
      </div>
    </header>
  )
}


export default App;