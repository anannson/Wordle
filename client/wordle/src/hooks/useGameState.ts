import { Reducer, useReducer } from "react";
import { PLAY_STATES, LINES } from "../constants";

export const INITIALIZE = "initialize";
export const HANDLE_INPUT = "handleInput";
export const SUBMIT = "submit";
export const WIN = "win";
export const LOSE = "lose";

interface State {
    solution: string;
    guesses: string[];
    currentLine: number;
    playState: keyof typeof PLAY_STATES;
}

type Action =
    | {
          type: typeof INITIALIZE;
          payload?: { solution?: string };
      }
    | { type: typeof HANDLE_INPUT; payload: { input: string } }
    | { type: typeof SUBMIT }
    | { type: typeof WIN | typeof LOSE };

type GameStateReducer = Reducer<State, Action>;

const INITIAL_STATE: State = Object.freeze({
    solution: "",
    guesses: new Array(LINES).fill(""),
    currentLine: 0,
    playState: PLAY_STATES.playing,
});

const gameStateReducer: GameStateReducer = (state, dispatch) => {
    switch (dispatch.type) {
        case INITIALIZE: {
            return {
                ...state,
                guesses: new Array(LINES).fill(""),
                currentLine: 0,
                playState: PLAY_STATES.playing,
                solution: dispatch.payload?.solution ?? "",
            };
        }
        case HANDLE_INPUT: {
            return {
                ...state,
                guesses: state.guesses.map((guess, i) =>
                    state.currentLine === i ? dispatch.payload.input : guess
                ),
            };
        }
        case SUBMIT: {
            return { ...state, currentLine: state.currentLine + 1 };
        }
        case WIN: {
            return { ...state, playState: PLAY_STATES.won };
        }
        case LOSE: {
            return { ...state, playState: PLAY_STATES.lost };
        }
        default: {
            return state;
        }
    }
};

const useGameState = () => useReducer(gameStateReducer, INITIAL_STATE);

export default useGameState;
