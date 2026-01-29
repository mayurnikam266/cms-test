'use client';

export default function ClearCacheButton() {
  const handleClearCache = () => {
    if (confirm('This will clear your login session and reload the page. Continue?')) {
      localStorage.clear();
      window.location.href = '/admin/login';
    }
  };

  return (
    <button
      onClick={handleClearCache}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
      title="Clear cache and restart login session"
    >
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Clear Cache & Re-login
      </span>
    </button>
  );
}
