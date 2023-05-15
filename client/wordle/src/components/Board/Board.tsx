import { FC, PropsWithChildren } from "react";
import classNames from "classnames";
import { WithStyles } from "../../types";
import Styles from "./Board.module.css";

const Board: FC<PropsWithChildren<WithStyles>> = ({
    children,
    className,
    style,
}) => (
    <div className={classNames(className, Styles.container)} style={style}>
        {children}
    </div>
);

export default Board;
