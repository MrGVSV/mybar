import { config } from '../config';
import { Colors } from '../enums';
import { styled, React } from 'uebersicht';

const TimeDiv = styled('div')`
    margin-right: 10px;
    margin-top: 2px;
    flex: 0;
`;

export default class Time extends React.Component {
    render() {
        // === Config === //
        let cfg = config.Time;

        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        // === Get Time === //
        let now = new Date();

        let components = [];
        let index = 0;
        for (let item of cfg.displayOrder) {
            let text = item;
            switch (item) {
                case 'W':
                    text = days[now.getDay()]
                    break;
                case 'w':
                    text = days[now.getDay()].substr(0, 3);
                    break;
                case 'M':
                    text = months[now.getMonth()];
                    break;
                case 'm':
                    text = monthsShort[now.getMonth()];
                    break;
                case 'D':
                    text = `${now.getDate()}`;
                    break;
                case 'd':
                    text = `${now.getDate() < 10 ? '0' : ''}${now.getDate()}`;
                    break;
                case 'Y':
                    text = `${now.getFullYear()}`;
                    break;
                case 'y':
                    text = `${now.getFullYear()}`;
                    text = text.substr(text.length - 2);
                    break;
                case 'H':
                    text = `${now.getHours() % 12 === 0 ? '12' : now.getHours() % 12}`    
                    break;
                case 'h':
                    text = `${now.getHours() < 10 ? '0' : ''}${now.getHours()}`    
                    break;
                case 'P':
                    text = `${now.getMinutes()}`    
                    break;
                case 'p':
                    text = `${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`    
                    break;
                case 'S':
                    text = `${now.getSeconds()}`    
                    break;
                case 's':
                    text = `${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`    
                    break;
                case '?':
                    text = `${now.getHours() > 12 ? 'PM' : 'AM'}`
                    break;
                default:
                    break;
            }

            // === Attach Associated Color === //
            let col = cfg.colors[item];
            if (col === null) {
                col = Colors.FG;
            }

            // === Add Component === //
            components.push(<span key={index} style={{color: col}}>{text}</span>)

            index++;
        }

        return <TimeDiv>{components}</TimeDiv>;
    }
}
