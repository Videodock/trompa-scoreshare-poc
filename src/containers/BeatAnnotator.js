import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import WaveSurfer, { getProgress } from "wavesurfer";
// import WaveSurfer from "./WaveSurfer";

export default function BeatAnnotator(props) {
    const { firebase, conductor } = props;

    const [wave, setWave] = useState();
    const [progress, setProgress] = useState(0);

    const loadWavesurfer = () => {
        firebase.setPlay(false);    //init off

        const w = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple'
        });
        // w.load("/sine.mp3");
        w.load("https://sugartune.s3.amazonaws.com/trompa_examples/out_Rossinyol_catanyol_vm0_sr1_pol_bass_47bpm_part4.wav");
        setWave(w);
    }
    function play(){
        if(!wave) return;
        wave.play();
        firebase.setPlay(true)
    }
    const stop = () => {
        if(!wave) return;
        wave.stop();
        firebase.setPlay(false)
    }
    const getProgress = () =>{
        const int = setTimeout(()=> {
            const p = wave.backend.getPlayedPercents();
            firebase.setProgress(p);
            setProgress(p);
        }, 10);
    }
    const onFirebaseUpdate = d => {
        // if(d.doPlay) play();
        // if(d.progress) wave.seekTo(d.progress);
    }
    
    useEffect(()=>{
        firebase.addListener(data => onFirebaseUpdate(data));
        loadWavesurfer();
    },[]);

    return (
        <div style={{width:'100%'}}>
            <button onClick={e => loadWavesurfer()}>Load</button>
            {wave && conductor && 
                <>
                    <button onClick={e => play()}>Playss</button>
                    <button onClick={e => stop()}>Stop</button>
                    {/* <button onClick={e => wave.seekTo(Number(progress))}>Skip Part</button> */}
                    {/* <button onClick={e => setProgress(wave.backend.getPlayedPercents())}>get progress</button> */}
                    {/* <TextField value={progress} onChange={e => setProgress(e.target.value)}/> */}
                </>
            }
            <div id="waveform" onClick={e => getProgress()}></div>
        </div>
    );
}