import { config, parseOutput } from "../config";
import { SpotifyStyle, Colors } from "../enums";
import { styled, React } from "uebersicht";

const SpotifyDiv = styled('div')`
position: relative;
display: inline-block;
whitespace: nowrap;
height: 100%;
margin-top: 2px;
flex: 0;
`

export default class Spotify extends React.Component {

    render() {
        let output = this.props.output;

        // === Config === //
        let cfg = config.Spotify;
    
        // === Parse Output === //
        let info = parseOutput(output, 'spotify');
    
        // === Escape If No Info === //
        if (Object.keys(info).length === 0) {
            if (cfg.displayDespiteNothing) {
                return (
                    <SpotifyDiv>Nothing Playing</SpotifyDiv>
                )
            } else {
                return (
                    <SpotifyDiv></SpotifyDiv>
                )
            }
        }
    
        // === Parse Info === //
    
        // --- Song --- //
        let song;
        if (cfg.displaySong.length > 0) {
            let SongSpan = styled('span')`
                color: ${cfg.displaySong};
                padding: 0 ${cfg.padding};
            `

            // -- Trim Feature List, Etc. -- //
            let songName = info['song'];
            if (cfg.shortenSong) {
                songName = songName.substring(0, songName.indexOf('(')).trim()
            }

            song = (
            <SongSpan>{songName}</SongSpan>
            )
        }
    
        // --- Artist --- //
        let artist;
        if (cfg.displayArtist.length > 0) {
            let ArtistSpan = styled('span')`
                color: ${cfg.displayArtist};
                padding: 0 ${cfg.padding};
            `
            artist = (
            <ArtistSpan>{info['artist']}</ArtistSpan>
            )
        }
    
        // --- Time --- //
        let totalTime = parseFloat(info['duration']) / 1000; // in ms for some reason
        let currentTime = parseFloat(info['position']);
        let time = null;
        if (cfg.displayTime === SpotifyStyle.TimeDisplay.TEXT) {
            let TimeSpan = styled('span')`
                color: ${cfg.timeColor};
                padding: 0 ${cfg.padding};
            `
            let duration = `${~~((totalTime % 3600) / 60)}:${(~~totalTime % 60) < 10 ? '0' : ''}${~~totalTime % 60}`
            if(cfg.invertTime) {
                currentTime = totalTime - currentTime;
                let remaining = `-${~~((currentTime % 3600) / 60)}:${(~~currentTime % 60) < 10 ? '0' : ''}${~~currentTime % 60}`
                time = <TimeSpan>{`${remaining}/${duration}`}</TimeSpan>
            } else {
                let remaining = `${~~((currentTime % 3600) / 60)}:${(~~currentTime % 60) < 10 ? '0' : ''}${~~currentTime % 60}`
                time = <TimeSpan>{`${remaining}/${duration}`}</TimeSpan>
            }
        } else if (cfg.displayTime === SpotifyStyle.TimeDisplay.ICON) {
            let TimeSVG = styled('svg')`
                height: 50%;
                vertical-align: -5%;
                transform-origin: center;
                transform: rotate(-90deg) ${cfg.invertTime ? 'scaleY(-1)' : ''};
                padding: 0 ${cfg.padding};
            `
    
            let timePercent = (currentTime/totalTime)*220;
            if (!cfg.invertTime) {
                timePercent = 220 - timePercent;
            }
    
            time = (
                <TimeSVG viewBox='0 0 100 100' stroke={cfg.timeFill} strokeWidth='25'>
                    <circle
                        cx='50'
                        cy='50'
                        r='30'
                        fill='none'
                        stroke={cfg.timeColor}
                        />
                    <circle
                        cx='50'
                        cy='50'
                        r='35'
                        fill='none'
                        strokeDasharray='220%'   
                        strokeDashoffset={`${timePercent}%`}
                        />
                </TimeSVG>
            )
        }
    
        // --- Artwork --- //
        let artwork;
        if (cfg.displayArtwork !== SpotifyStyle.ArtDisplay.NONE && info['artwork'] !== 'null') {            
            let ArtworkImg = styled('img')`
                height: ${cfg.displayArtwork === SpotifyStyle.ArtDisplay.SHOW ? '80' : '75'}%;
                vertical-align: top;
                padding: 0 ${cfg.padding};
                ${cfg.displayArtwork === SpotifyStyle.ArtDisplay.SHOW ? '' : 'border: 1px solid white;'}
            `
    
            artwork = (
                <ArtworkImg src={info['artwork']}></ArtworkImg>
            );
        }
    
        // --- Shuffle --- //
        let shuffle;
        if (cfg.displayShuffle.length > 0 && info['shuffle'] === 'true') {
    
            let ShuffleSVG = styled('svg')`
                height: 55%;
                fill: ${cfg.displayShuffle};
                vertical-align: -7.5%;
                padding: 0 ${cfg.padding};
            `
    
            shuffle = (
                    <ShuffleSVG viewBox="0 0 24 24">
                        <path d="M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z" />
                    </ShuffleSVG>
            );
        }        
        
        // --- Repeat --- //
        let repeat;
        if (cfg.displayRepeat.length > 0 && info['repeat'] === 'true') {
    
            let RepeatSVG = styled('svg')`
                height: 55%;
                fill: ${cfg.displayRepeat};
                vertical-align: -7.5%;
                padding: 0 ${cfg.padding};
            `
    
            repeat = (
                    <RepeatSVG viewBox="0 0 24 24">
                        <path d="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" />
                    </RepeatSVG>
            );
        }
        
        // --- Get Order --- //
        let components = []
        let index = 0;
        for (let item of cfg.displayOrder) {
            switch (item) {
                case 'I':
                    if(artwork === null || artwork === undefined){break;}
                    let clonedArtwork = React.cloneElement(
                        artwork, 
                        { key: index }
                    );
                    components.push(clonedArtwork)
                    break;
                case 'S':
                    if(song === null || song === undefined){break;}
                    let clonedSong = React.cloneElement(
                        song, 
                        { key: index }
                    );
                    components.push(clonedSong);
                    break;
                case 'A':
                    if(artist === null || artist === undefined){break;}
                    let clonedArtist = React.cloneElement(
                        artist, 
                        { key: index }
                    );
                    components.push(clonedArtist);
                    break;
                case 'T':
                    if(time === null || time === undefined){break;}
                    let clonedTime = React.cloneElement(
                        time, 
                        { key: index }
                    );
                    components.push(clonedTime);
                    break;
                case 's':
                    if(shuffle === null || shuffle === undefined){break;}
                    let clonedShuffle = React.cloneElement(
                        shuffle, 
                        { key: index }
                    );
                    components.push(clonedShuffle);
                    break;
                case 'r':
                    if(repeat === null || repeat === undefined){break;}
                    let clonedRepeat = React.cloneElement(
                        repeat, 
                        { key: index }
                    );
                    components.push(clonedRepeat);
                    break;
                default:
                    let TextSpan = styled('span')`
                        padding: 0 ${cfg.padding};
                    `
                    components.push(
                        <TextSpan key={index}>{item}</TextSpan>
                    )
                    break;
            }
            index++;
        }
    
        return (
            <SpotifyDiv>
                {components}
            </SpotifyDiv>
        )
    
    }
}
