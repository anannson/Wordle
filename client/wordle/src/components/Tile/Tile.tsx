import { FC, PropsWithChildren } from "react";
import { WithStyles } from "../../types";

import Styles from "./Tile.module.css";
import classNames from "classnames";

const Tile: FC<PropsWithChildren & WithStyles> = ({
    children,
    className,
    style,
}) => (
    <div className={classNames(className, Styles.container)} style={style}>
        {children}
    </div>
);

export default Tile;
