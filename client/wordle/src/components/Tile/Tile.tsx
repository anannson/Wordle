import { FC, PropsWithChildren } from "react";
import { WithStyles } from "../../types";

import Styles from "./Tile.module.css";
import classNames from "classnames";

export const EMPTY = "empty";
export const CORRECT = "correct";
export const CLOSE = "close";
export const INCORRECT = "incorrect";

export type TileVariant =
    | typeof EMPTY
    | typeof CORRECT
    | typeof CLOSE
    | typeof INCORRECT;

interface TileProps {
    variant?: TileVariant;
}

const Tile: FC<PropsWithChildren<TileProps & WithStyles>> = ({
    children,
    variant = "empty",
    className,
    style,
}) => (
    <p
        className={classNames(className, Styles.container, Styles[variant])}
        style={style}
    >
        {children}
    </p>
);

export default Tile;
