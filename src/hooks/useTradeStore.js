import { useEffect, useMemo, useReducer, useState } from 'react'
import { DEFAULT_CATEGORIES, generateDemoTrades } from '../lib/demoData'
import { getSyncCode, loadState, saveState, setSyncCode as persistSyncCode } from '../lib/storage'
import { generateSyncCode, pullState, pushState } from '../lib/sync'

const DEFAULT_STATE = {
  categories: DEFAULT_CATEGORIES,
  plMode: 'money',
  startingBalance: 10000,
}

function initState() {
  const saved = loadState()
  if (saved) return { ...DEFAULT_STATE, ...saved }
  return { ...DEFAULT_STATE, trades: generateDemoTrades() }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRADE':
      return { ...state, trades: [...state.trades, action.trade] }
    case 'UPDATE_TRADE':
      return {
        ...state,
        trades: state.trades.map((t) => (t.id === action.trade.id ? action.trade : t)),
      }
    case 'DELETE_TRADE':
      return { ...state, trades: state.trades.filter((t) => t.id !== action.id) }
    case 'ADD_CATEGORY': {
      if (state.categories.includes(action.category)) return state
      return { ...state, categories: [...state.categories, action.category] }
    }
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter((c) => c !== action.category) }
    case 'SET_PL_MODE':
      return { ...state, plMode: action.mode }
    case 'SET_STARTING_BALANCE':
      return { ...state, startingBalance: action.amount }
    case 'CLEAR_ALL':
      return { ...state, trades: [] }
    case 'HYDRATE':
      return { ...DEFAULT_STATE, ...action.state }
    default:
      return state
  }
}

export function useTradeStore() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  const [syncCode, setSyncCodeState] = useState(() => getSyncCode())
  const [syncStatus, setSyncStatus] = useState(() => (getSyncCode() ? 'syncing' : 'idle'))
  const [syncError, setSyncError] = useState(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  // Pull remote data whenever the sync code changes (mount, link, or a fresh code).
  // If nothing exists remotely yet, seed it with whatever is currently local.
  useEffect(() => {
    if (!syncCode) {
      setSyncStatus('idle')
      return
    }
    let cancelled = false
    setSyncStatus('syncing')
    setSyncError(null)

    async function run() {
      const remote = await pullState(syncCode)
      if (cancelled) return
      if (remote) {
        dispatch({ type: 'HYDRATE', state: remote.data })
      } else {
        await pushState(syncCode, state)
      }
    }

    run()
      .then(() => {
        if (!cancelled) setSyncStatus('synced')
      })
      .catch((err) => {
        if (cancelled) return
        setSyncStatus('error')
        setSyncError(err.message)
      })

    return () => {
      cancelled = true
    }
    // Re-run only when the sync code itself changes — including `state` here
    // would push on every pull and fight the hydration above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncCode])

  // Push local changes to the server once the initial pull has settled.
  useEffect(() => {
    if (!syncCode || syncStatus === 'syncing') return
    const handle = setTimeout(() => {
      pushState(syncCode, state)
        .then(() => setSyncStatus('synced'))
        .catch((err) => {
          setSyncStatus('error')
          setSyncError(err.message)
        })
    }, 600)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, syncCode])

  const actions = useMemo(
    () => ({
      addTrade: (trade) => dispatch({ type: 'ADD_TRADE', trade }),
      updateTrade: (trade) => dispatch({ type: 'UPDATE_TRADE', trade }),
      deleteTrade: (id) => dispatch({ type: 'DELETE_TRADE', id }),
      addCategory: (category) => dispatch({ type: 'ADD_CATEGORY', category }),
      deleteCategory: (category) => dispatch({ type: 'DELETE_CATEGORY', category }),
      setPlMode: (mode) => dispatch({ type: 'SET_PL_MODE', mode }),
      setStartingBalance: (amount) => dispatch({ type: 'SET_STARTING_BALANCE', amount }),
      clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
      startSync: () => {
        const next = generateSyncCode()
        persistSyncCode(next)
        setSyncCodeState(next)
      },
      linkSync: (code) => {
        persistSyncCode(code)
        setSyncCodeState(code)
      },
      stopSync: () => {
        persistSyncCode(null)
        setSyncCodeState(null)
        setSyncStatus('idle')
        setSyncError(null)
      },
    }),
    [],
  )

  return {
    trades: state.trades,
    categories: state.categories,
    plMode: state.plMode,
    startingBalance: state.startingBalance,
    syncCode,
    syncStatus,
    syncError,
    ...actions,
  }
}
