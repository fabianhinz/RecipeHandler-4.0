import produce from 'immer'
import create, { State, StateCreator, UseStore } from 'zustand'
import { devtools } from 'zustand/middleware'

// util function that wrapps common behaviour (redux devtools and state updates)
const createStore = <StoreState extends State>(
  config: StateCreator<StoreState, (fn: (draft: StoreState) => void) => void>,
  prefix?: string
): UseStore<StoreState> =>
  create(devtools((set, get, api) => config(fn => set(produce(fn)), get, api), prefix))

export default createStore
