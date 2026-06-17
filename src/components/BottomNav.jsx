const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors ${
      active ? "text-eco-600 nav-active" : "text-gray-400 hover:text-gray-600"
    }`}
  >
    {icon}
    <span className={`text-xs font-medium ${active ? "text-eco-600" : ""}`}>
      {label}
    </span>
  </button>
);

const MapIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
);

const FeedIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ListIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default function BottomNav({ tab, setTab, onNova }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-40 safe-area-pb">
      <div className="flex items-center max-w-lg mx-auto">
        <NavItem
          icon={<MapIcon />}
          label="Mapa"
          active={tab === "mapa"}
          onClick={() => setTab("mapa")}
        />
        <NavItem
          icon={<FeedIcon />}
          label="Feed"
          active={tab === "feed"}
          onClick={() => setTab("feed")}
        />

        {/* Central CTA button */}
        <div className="flex-1 flex justify-center py-2">
          <button
            onClick={onNova}
            className="w-14 h-14 bg-eco-600 hover:bg-eco-700 active:scale-95 rounded-2xl
                       flex items-center justify-center shadow-elevated transition-all duration-150"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <NavItem
          icon={<ListIcon />}
          label="Minhas"
          active={tab === "minhas"}
          onClick={() => setTab("minhas")}
        />
        <NavItem
          icon={<UserIcon />}
          label="Perfil"
          active={tab === "perfil"}
          onClick={() => setTab("perfil")}
        />
      </div>
    </nav>
  );
}
