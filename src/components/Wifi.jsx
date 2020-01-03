import { config, parseOutput } from "../config";
import { WifiStyle, Colors } from "../enums";
import { styled, React } from "uebersicht";

const WifiDiv = styled("div")`
    position: relative;
    display: inline-block;
    whitespace: nowrap;
    height: 100%;
    bottom: 1px;
    flex: 0;
`;

export default class Wifi extends React.Component {
    render() {
        let output = this.props.output;

        // === Config === //
        let cfg = config.Wifi;

        // === Parse Output === //
        let name = parseOutput(output, "wifi");
        let rawStrength = parseOutput(output, "snr");
        let wifiStatus = parseOutput(output, "status") === "true";

        // === Get Strength === //
        let strength = cfg.thresholds.length;
        if (wifiStatus) {
            for (const [index, thresh] of cfg.thresholds.entries()) {
                if (rawStrength <= thresh) {
                    strength = index;
                    break;
                }
            }
        }

        // === Fill The Colors Array === //
        for (let i = 0; i <= cfg.thresholds.length - cfg.filledColors.length; i++) {
            cfg.filledColors.push(
                cfg.filledColors[cfg.filledColors.length - 1],
            );
        }

        // === Get Color by Strnegth Value === //
        let colorByStrength = () => {
            if (!wifiStatus) {
                // IF no wifi: hide
                return "none";
            } else if (strength-- > 0) {
                // IF bar is to be filled: get it's color
                let col = Math.min(
                    cfg.thresholds.length - 1 - strength,
                    cfg.thresholds.length - 1,
                );
                return cfg.filledColors[col];
            } else {
                // Return the empty color
                return cfg.emptyBarColor;
            }
        };

        let WifiSVG = styled("svg")`
            height: 90%;
            vertical-align: top;
            padding-left: 3px;
        `;

        let WifiName = styled('span')`
            display: ${cfg.displayName ? "initial" : "none"};
            paddingRight: 3px;
            verticalAlign: bottom;
        `;

        let components = [];
        components.push(
            <WifiSVG
                key="0"
                viewBox="0 0 100 100"
                stroke="white"
                strokeWidth="5"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    style={{ fill: colorByStrength() }}
                    cx="50"
                    cy="80"
                    r="5"
                    strokeWidth="0"
                />

                <path
                    style={{ stroke: colorByStrength() }}
                    d="
                        M 35 70
                        Q 50 60, 65 70
                    "
                    stroke={cfg.emptyBarColor}
                    fill="none"
                />
                <path
                    style={{ stroke: colorByStrength() }}
                    d="
                        M 25 60
                        Q 50 40, 75 60
                    "
                    stroke={cfg.emptyBarColor}
                    fill="none"
                />
                <path
                    style={{ stroke: colorByStrength() }}
                    d="
                        M 15 50
                        Q 50 20, 85 50
                    "
                    stroke={cfg.emptyBarColor}
                    fill="none"
                />
                <path
                    style={{ stroke: colorByStrength() }}
                    d="
                        M 5 40
                        Q 50 0, 95 40
                    "
                    stroke={cfg.emptyBarColor}
                    fill="none"
                />
                <path
                    style={{ stroke: wifiStatus ? "none" : "white" }}
                    d="
                        M 5 40
                        Q 50 0, 95 40
                        L 50 82.5
                        Z
                    "
                    stroke="none"
                    fill="none"
                    stroke="none"
                />
            </WifiSVG>,
        );

        // === Display the Name Either Left or Right === //
        if (cfg.displayName === WifiStyle.NamePosition.LEFT) {
            components.unshift(
                <WifiName key="1">
                    {name}
                </WifiName>,
            );
        } else if (cfg.displayName === WifiStyle.NamePosition.RIGHT) {
            components.push(
                <WifiName key="1">
                    {name}
                </WifiName>,
            );
        }

        return <WifiDiv>{components}</WifiDiv>;
    }
}
