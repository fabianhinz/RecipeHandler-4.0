import { useReducer, Reducer, Dispatch } from "react";

interface State {
    dialog: boolean;
    email: string;
    password: string;
}

export type HeaderChangeKey = keyof Pick<State, "email" | "password">;

type Action =
    | {
          type: "textFieldChange";
          key: HeaderChangeKey;
          value: string;
      }
    | { type: "dialogChange" };

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case "textFieldChange":
            return { ...state, [action.key]: action.value };
        case "dialogChange":
            return { ...state, dialog: !state.dialog };
    }
};

const initialState: State = {
    dialog: false,
    email: "",
    password: ""
};

export const useHeaderReducer = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return { state, dispatch };
};

export type HeaderState<T extends keyof State> = Pick<State, T>;

export interface HeaderDispatch {
    dispatch: Dispatch<Action>;
}
