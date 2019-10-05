import { Dispatch, Reducer, useReducer } from 'react'

interface State {
    dialogOpen: boolean
    trialsOpen: boolean
    email: string
    password: string
}

export type HeaderChangeKey = keyof Pick<State, 'email' | 'password'>

type Action =
    | {
          type: 'textFieldChange'
          key: HeaderChangeKey
          value: string
      }
    | { type: 'dialogChange' }
    | { type: 'trialsChange' }

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case 'textFieldChange':
            return { ...state, [action.key]: action.value }
        case 'dialogChange':
            return { ...state, dialogOpen: !state.dialogOpen }
        case 'trialsChange':
            return { ...state, trialsOpen: !state.trialsOpen }
    }
}

const initialState: State = {
    dialogOpen: false,
    email: '',
    password: '',
    trialsOpen: false,
}

export const useHeaderReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return { state, dispatch }
}

export type HeaderState<T extends keyof State> = Pick<State, T>

export interface HeaderDispatch {
    dispatch: Dispatch<Action>
}
