import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

const Scenario = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 28 27">
      <defs>
        <filter colorInterpolationFilters="auto" id="filter-1">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0.835294 0 0 0 0 0.168627 0 0 0 0 0.117647 0 0 0 1.000000 0"
          ></feColorMatrix>
        </filter>
      </defs>
      <g
        id="Vision-Screens"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        opacity="0.699059775"
      >
        <g
          id="Lily-CreateNew-V02"
          transform="translate(-819.000000, -275.000000)"
        >
          <g
            id="scenario-for-trial"
            transform="translate(819.000000, 275.000000)"
            filter="url(#filter-1)"
          >
            <g id="noun_multiple_634392" fill="#82786F" fillRule="nonzero">
              <g id="Group">
                <path
                  d="M27.9885128,9.59302703 L14.000359,0.351364865 L0.0114871795,9.59302703 L14.000359,18.8346892 L27.9885128,9.59302703 Z M14.000359,1.90422973 L25.6372308,9.59302703 L14.000359,17.2818243 L2.36276923,9.59302703 L14.000359,1.90422973 Z"
                  id="Shape"
                ></path>
                <polygon
                  id="Path"
                  points="14.000359 21.1887973 1.53605128 12.9537973 0.838205128 14.0462027 14.000359 22.7416622 27.1625128 14.0462027 26.4646667 12.9537973"
                ></polygon>
                <polygon
                  id="Path"
                  points="14.000359 25.0957703 1.53605128 16.8607703 0.838205128 17.9531757 14.000359 26.6486351 27.1625128 17.9531757 26.4646667 16.8607703"
                ></polygon>
              </g>
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  );
};

export default Scenario;
