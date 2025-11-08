export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-white/70 mb-6">
          There was an error during authentication. Please try again.
        </p>
        <a
          href="/login"
          className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
        >
          Return to Login
        </a>
      </div>
    </div>
  )
}

