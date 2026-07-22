'use client'

import { useStore } from '@/store/useStore'

export default function Home() {
  const { count, increment, decrement, reset } = useStore()

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Next.js + Supabase + Zustand
          </h1>
          <p className="text-sm text-slate-400">
            Project nonopoint was successfully initialized.
          </p>
        </div>

        {/* Zustand Demo Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 text-center space-y-4">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Zustand Store Demo
          </span>
          <div className="text-5xl font-extrabold text-white">{count}</div>
          <div className="flex justify-center gap-3">
            <button
              onClick={decrement}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
            >
              Decrement
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={increment}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
            >
              Increment
            </button>
          </div>
        </div>

        {/* Status Checklist */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-slate-300">Included Integrations</h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Next.js 15+ App Router (`src/app`)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Tailwind CSS Configured
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Zustand Client State Management (`src/store/useStore.ts`)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Supabase Client Prepared (`src/lib/supabase.ts`)
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
