import { useEffect, useMemo, useReducer } from 'react'
import { DEFAULT_CATEGORIES, generateDemoTrades } from '../lib/demoData'
import { loadState, saveState } from '../lib/storage'

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
    default:
      return state
  }
}

export function useTradeStore() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)

  useEffect(() => {
    saveState(state)
  }, [state])

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
    }),
    [],
  )

  return {
    trades: state.trades,
    categories: state.categories,
    plMode: state.plMode,
    startingBalance: state.startingBalance,
    ...actions,
  }
}
