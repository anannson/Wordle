import { FC, PropsWithChildren } from "react";
import Styles from "./Line.module.css";
import { WithStyles } from "../../types";
import classNames from "classnames";

const Line: FC<PropsWithChildren<WithStyles>> = ({
    children,
    className,
    style,
}) => (
    <div className={classNames(className, Styles.container)} style={style}>
        {children}
    </div>
);

export default Line;
