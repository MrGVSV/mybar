import { config, parseOutput } from '../config'
import { BatteryStyle, Colors } from "../enums";
import { styled, React  } from "uebersicht";

const BatteryDiv = styled('div')`
position: relative;
display: inline-block;
font-family: 'Source Code Pro', monospace;
margin-top: 1px;
flex: 0;
`

export default class Battery extends React.Component {

    render() {
        let output = this.props.output;

        // === Config === //
        let cfg = config.Battery;

        // === Parse Output === //
        let charge = parseOutput(output, 'charge');
        let isPluggedIn = parseOutput(output, 'plugged') === 'true';
        
        // === Get Charge === //
        let chargeVal = parseInt(charge);
        // Limit to 0-100
        chargeVal = Math.min(chargeVal, 100);
        chargeVal = Math.max(chargeVal, 0);
        // Get the amount of ticks in the battery
        let totalTicks = 100 / (cfg.tickValue * 100);
        // Get the amount of ticks to fill
        let ticksToFill = Math.ceil(chargeVal / (cfg.tickValue * 100));

        let color;
        if (cfg.colorSteps === BatteryStyle.Colors.DEFAULT) {
            if(chargeVal <= 25) {
                color = Colors.RED;
            } else if (chargeVal <= 50) {
                color = Colors.YELLOW;
            } else {
                color = Colors.GREEN;
            }
        } else if (cfg.colorSteps !== BatteryStyle.Colors.NONE) {		
            color = cfg.colorSteps(chargeVal);
        }

        let batteryFillColor = {
            color: color,
            fontSize: '90%'
        }

        // Should the alert be animated? Default: Big number (nearly no animation)
        let shouldAnimate = 10000000000;
        // What should the alert read?
        let alertText = '';
        if(chargeVal < (cfg.dyingThreshold * 100) && cfg.showDying && !isPluggedIn) {
            // IF dying -> display 'needs charge' alert
            alertText = cfg.dyingIcon;
            if(cfg.animateAlerts === BatteryStyle.Animation.ApplyFor.DYING || cfg.animateAlerts === BatteryStyle.Animation.ApplyFor.BOTH) {
                // determine if alert is allowed to be animated
                shouldAnimate = cfg.animationInterval;
            }
        } else if (cfg.showCharging && isPluggedIn) {
            // IF charging -> display 'plugged' alert
            alertText = cfg.chargingIcon;
            if(cfg.animateAlerts === BatteryStyle.Animation.ApplyFor.CHARGING || cfg.animateAlerts === BatteryStyle.Animation.ApplyFor.BOTH) {
                // determine if alert is allowed to be animated
                shouldAnimate = cfg.animationInterval;
            }
        }
        

        let BatteryAlert = styled('div')`
        position: absolute;
        top: 35%;
        left: 50%;
        
        text-align: center;
        font-size: 90%;
        font-weight: bolder;

        transform-origin: 46% 55%;
        animation: anim ${shouldAnimate}ms linear infinite;
        ${cfg.animationType}
        `

        return (
            <BatteryDiv style={{letterSpacing: '2px'}}>
                <span>[</span>
                <span style={batteryFillColor}>{cfg.tick.repeat(ticksToFill)}</span>
                <span style={{opacity: cfg.unfilledOpacity, fontSize: '90%'}}>{cfg.tick.repeat(totalTicks - ticksToFill)}</span>
                <span>]</span>
                <BatteryAlert>{alertText}</BatteryAlert>
            </BatteryDiv>
        )
    }

}