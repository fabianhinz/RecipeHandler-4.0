import createStore from './helper/createStore'

export type LayoutStoreState = {
  gridListActive: boolean
}

export type LayoutStoreActions = {
  setPartialLayout: (state: Partial<LayoutStoreState>) => void
}

type LayoutStore = LayoutStoreState & LayoutStoreActions

export const useLayoutStore = createStore<LayoutStore>(
  set => ({
    gridListActive: false,
    setPartialLayout: partialState => {
      set(() => partialState)
    },
  }),
  'LayoutStore'
)
