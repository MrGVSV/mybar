import { config, parseOutput } from '../config'
import { Colors } from "../enums";
import { styled, React  } from "uebersicht";

const AppDiv = styled('div')`
position: relative;
display: inline-block;
font-family: 'Source Code Pro', monospace;
margin-top: 2px;
min-width: ${config.Application.paddedWidth};
flex: 0;
`

export default class Application extends React.Component {
    render() {
        let output = this.props.output;

        // === Config === //
        let cfg = config.Application;

        // === Parse Output === //
        let frontmost = parseOutput(output, 'app');

        return (
            <AppDiv>{frontmost}</AppDiv>
        )
    }
}