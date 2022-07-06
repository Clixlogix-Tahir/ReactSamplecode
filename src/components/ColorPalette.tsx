import React, { useEffect, useState } from "react";
import { HelpOutlineOutlined } from "@material-ui/icons";
import customThemeStyles from "../theme/customeThemeStyles";
type ColorPalettePropType = {
  palette: any;
  placeValue: number;
  keyName: any;
  outerIndex: number;
  index: number;
  values: any;
};
const ColorPalette = ({
  palette,
  placeValue,
  keyName,
  outerIndex,
  index,
  values,
}: ColorPalettePropType) => {
  const customThemeClasses = customThemeStyles();
  const [R, setR] = useState<number>();
  const [G, setG] = useState<number>();
  const [B, setB] = useState<number>();
  const [A, setA] = useState<number>();
  const [style, setStyle] = useState<any>({});
  useEffect(() => {
    if (palette) {
      let arr: string[] = [];

      var regex = /(\w|\s)*\w(?=")|\w+/g;
      var data = palette.match(regex);
      data?.map((x: any) => {
        x.split(" ").map((y: any) => {
          arr.push(y);
        });
      });

      if (typeof parseInt(arr[0]) === "number") {
        let r = arr[0] === "NaN" ? 0 : parseInt(arr[0]);
        let g = arr[1] === "NaN" ? 0 : parseInt(arr[1]);
        let b = arr[2] === "NaN" ? 0 : parseInt(arr[2]);
        let a = arr[3] === "NaN" ? 0 : parseInt(arr[3]);

        if (r && b && g && a) {
          setR(r);
          setG(g);
          setB(b);
          setA(a);
        }
      }
    }
  }, [palette]);

  useEffect(() => {
    if (R && R === undefined && G && G === undefined && B && B === undefined && A && A === undefined) {
      setStyle({ background: `rgb(255,255,255)` });
    } else {
      //let data = `${R && R !== undefined ? R : null} ${G && G !== undefined ? G : null} ${B && B !== undefined ? B : null} ${A && A !== undefined ? A : null}`
      let data = {R,G, B, A};
      values(data, placeValue, keyName, outerIndex, index, values);
      setStyle({
        background: `rgba(${R},${G},${B},${A})`,
      });
    }
  }, [R, G, B, A]);

  return (
    <div className={customThemeClasses.colorBoxContainer}>
      <div className={customThemeClasses.colorFieldWrp}>
        <div className={customThemeClasses.colorPickerWrp}>
          <span
            style={style}
            className={customThemeClasses.colorPickerBox}
          ></span>
          <span className={customThemeClasses.RGB}>RGB</span>
        </div>
        <div className={customThemeClasses.customColorValueField}>
          <div className={customThemeClasses.brdrInput}>
            <input
              type="text"
              value={R}
              onChange={(e: any) => setR(e.target.value as number)}
            />
            <input
              type="text"
              value={G}
              onChange={(e: any) => setG(e.target.value as number)}
            />
            <input
              type="text"
              value={B}
              onChange={(e: any) => setB(e.target.value as number)}
            />
          </div>
          <div className={customThemeClasses.singleInputValue}>
            <input
              type="text"
              value={A}
              onChange={(e: any) => setA(e.target.value as number)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
