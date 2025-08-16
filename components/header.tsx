export function Header() {
  return (
    <div className="text-center mb-12 relative">
      <div className="relative">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 font-mono tracking-wider neon-text">
          TODO
        </h1>
        <div className="absolute inset-0 text-6xl font-bold text-purple-500/20 font-mono tracking-wider blur-sm">
          TODO
        </div>
      </div>
      <p className="text-gray-300 text-lg font-light tracking-wide mb-2">Manage your tasks in the digital realm</p>
      <p className="text-purple-400/70 text-sm font-mono">[SYSTEM ONLINE] • [NEURAL LINK ACTIVE]</p>
      <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full shadow-lg shadow-purple-500/50 glow-border"></div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
        <div className="text-purple-400/50 font-mono text-xs">╔═══════════════╗</div>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4">
        <div className="text-purple-400/50 font-mono text-xs">╚═══════════════╝</div>
      </div>
    </div>
  )
}
