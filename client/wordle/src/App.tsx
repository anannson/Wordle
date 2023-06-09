import { useEffect } from "react";

import Board from "./components/Board/Board";
import Line from "./components/Line/Line";
import Tile, {
    EMPTY,
    CORRECT,
    CLOSE,
    INCORRECT,
    TileVariant,
} from "./components/Tile/Tile";

import useGameState, {
    INITIALIZE,
    HANDLE_INPUT,
    SUBMIT,
    WIN,
    LOSE,
} from "./hooks/useGameState";

import { PLAY_STATES, LINES } from "./constants";

import solutions from "./assets/5LetterWords.json";

const inputMatch = /^[a-zA-Z]$/;

function getTileVariant(
    guess: string,
    solution: string,
    lineIdx: number,
    guessIdx: number,
    currentLine: number
): TileVariant {
    // Only apply a class to submitted lines
    if (currentLine <= lineIdx) {
        return EMPTY;
    }

    const letter = guess[guessIdx]?.toLowerCase();

    // Can't compare if there is no letter, apply nothing
    if (!letter) {
        return EMPTY;
    }

    solution = solution.toLowerCase();

    if (solution.includes(letter)) {
        return guess[guessIdx] === solution[guessIdx] ? CORRECT : CLOSE;
    }

    return INCORRECT;
}

function validWord(input: string, wordSet: string[]): boolean {
    if (input.length !== 5) {
        return false;
    }

    // Only words in the word set are considered valid submissions
    return !!wordSet.find((word) => word.toLowerCase() === input.toLowerCase());
}

const App = () => {
    const [{ solution, guesses, currentLine, playState }, setGameState] =
        useGameState();

    // Handle fetching our solution whenever the user starts playing
    useEffect(() => {
        if (playState === PLAY_STATES.playing) {
            const solutionIdx = Math.ceil(Math.random() * solutions.length);

            console.log("Solution:", solutions[solutionIdx]);

            setGameState({
                type: INITIALIZE,
                payload: { solution: solutions[solutionIdx] },
            });
        }
    }, [playState, setGameState]);

    // Handle user input
    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            // Ignore keystrokes until the user resets the board
            if (playState !== PLAY_STATES.playing) {
                return;
            }

            const input = guesses[currentLine];

            switch (e.key) {
                case "Enter": {
                    // Only allow a submit if the user has a full word
                    if (validWord(input, solutions)) {
                        setGameState({ type: SUBMIT });
                    }

                    break;
                }
                case "Backspace": {
                    // Remove the last character
                    setGameState({
                        type: HANDLE_INPUT,
                        payload: { input: input.slice(0, input.length - 1) },
                    });

                    break;
                }
                default: {
                    // If we hit a valid key and can add more characters then update the input
                    if (inputMatch.test(e.key) && input.length < 5) {
                        setGameState({
                            type: HANDLE_INPUT,
                            payload: { input: input + e.key.toLowerCase() },
                        });
                    }

                    break;
                }
            }
        };

        window.addEventListener("keydown", keydownHandler);

        return () => {
            window.removeEventListener("keydown", keydownHandler);
        };
    }, [currentLine, guesses, playState, setGameState]);

    // Handle our play state
    useEffect(() => {
        // There is no solution yet, do nothing
        if (!solution) {
            return;
        }

        const lastGuess = guesses[currentLine - 1];

        // The user hasn't made any guesses yet, do nothing
        if (!lastGuess) {
            return;
        }

        // The user wins if the latest guess matches the solution
        // The user loses if they exceed the number of lines of the board
        if (lastGuess.toLowerCase() === solution.toLowerCase()) {
            setGameState({
                type: WIN,
            });
        } else if (currentLine >= LINES) {
            setGameState({
                type: LOSE,
            });
        }
    }, [guesses, solution, currentLine, setGameState]);

    return (
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
            <Board>
                {guesses.map((guess, i) => (
                    <Line key={i}>
                        {solution.split("").map((_char, j) => {
                            const letter = guess[j];

                            return (
                                <Tile
                                    key={j}
                                    variant={getTileVariant(
                                        guess,
                                        solution,
                                        i,
                                        j,
                                        currentLine
                                    )}
                                >
                                    {letter}
                                </Tile>
                            );
                        })}
                    </Line>
                ))}

                {playState !== PLAY_STATES.playing && (
                    <button
                        autoFocus
                        onClick={(_e) => setGameState({ type: INITIALIZE })}
                    >{`You ${
                        playState === PLAY_STATES.won ? "Win!" : "Lose."
                    } Play Again?`}</button>
                )}
            </Board>
        </div>
    );
};

export default App;
