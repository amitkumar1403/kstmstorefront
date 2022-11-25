// Base Imports
import React, { FC } from "react";

// Other Imports


interface IColorFilledSquareProps {
    readonly width: number;
    readonly height: number;
    readonly bgColor: string;
}

export const ColorFilledSquare: FC<IColorFilledSquareProps> = (props: IColorFilledSquareProps) => {
    const { width = 0, height = 0, bgColor = "#FFF" } = props;
    return (
        <div className="square" style={{ display: 'flex', width: `${width}px`, height: `${height}px`, backgroundColor: `${bgColor}` }}>
            {/*<p className="text">Square text</p>*/}
        </div>
    );
};