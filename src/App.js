import React, { useEffect, useState } from 'react'


import { MultiModalComponent } from 'trompa-multimodal-component';
import { Box, AppBar, Button, Dialog, Toolbar } from '@material-ui/core';

import FirebaseShell from './FirebaseShell';
import ScoreContainer from './containers/ScoreContainer'
import BeatAnnotator from './containers/BeatAnnotator';

const demoUri = "testb.mei"; //"https://orchestra-usecase.s3-eu-west-1.amazonaws.com/ClarT-TisByThyStrength.mei"; //"c.mei";//"https://api-test.trompamusic.eu/1eba97fa-602b-4d36-8f73-b169be0ceeb2";
const demo = {source:demoUri};

const SELECT_MEASURE = 0;
const SELECT_NOTE    = 1;
const SELECT_DEFAULT = SELECT_MEASURE;
const TYPES          = ['measure', 'note'];

const DIALOG_SHEET = 1;
const DIALOG_AUDIO = 2;

/*
*
*  SheetShare
*
*/

export default function App(props){

  const firebase                        = new FirebaseShell();

  const [dialog, setDialog]             = useState(false);
  const [score, setScore]               = useState();
  const [selectType, setSelectType]     = useState(SELECT_DEFAULT);
  const [selection, setSelection]       = useState([]);
  const [annotations, setAnnotations]   = useState([]);
  const [audio, setAudio]               = useState();

  const urlParams = new URLSearchParams(window.location.search);
  const conductor = urlParams.get('conductor') === "1433622342352";

  // Loading data from CE
  const loadCENode = node => {
    if(!node.source) throw('no source');

    if(dialog === DIALOG_SHEET) loadScore(node);
    if(dialog === DIALOG_AUDIO) loadAudio(node);

    setDialog(false);
  }
  const loadScore = node => {
    if(node && !isMei(node)) throw("Is not a MEI score");
    setScore(node);
    firebase.setScore(node);
  }
  const loadAudio = node => {
    //if(node && !isAudio(node)) throw("Is not really audio");
    setAudio(node);
    setScore();
    firebase.setAudio(node);
  }

  // Internal changes
  const switchType = () => {
    if(!conductor) return;
    const type = selectType === SELECT_MEASURE? SELECT_NOTE : SELECT_MEASURE;
    setSelectType(type);
    firebase.setSelectType(type);
  }
  const onSetSelection = (_selection) => {
    setSelection(_selection);
    if(conductor) firebase.setSelection(_selection);
  }
  const onSetAnnotation = (_annotation) => {
    if(!conductor) return;
    if(!score || !selection.length) throw ("Can't annotate without selection");
    const obj = {
      "@context": "http://www.w3.org/ns/anno.jsonld",
      body: [
        { type: 'TextualBody', value: _annotation}
      ],
      motivation: "describing",
      target: selection.map(s => ({ id: `${score.source}#${s}`}) ),
      type: "Annotation"
    };

    const arr = [...annotations, obj];
    setAnnotations(arr);
    firebase.setAnnotations(arr);
  }
  const removeAnnotation = (i) => {
    if(!conductor) return;
    let arr = annotations.slice();
    arr.splice(i, 1);
    
    setAnnotations(arr);
    firebase.setAnnotations(arr);
  }
  
  // Listen to firebase updates
  const onFirebaseUpdate = d => {
    if(d.score)        loadScore(d.score);
    if(d.audio)        loadAudio(d.audio);
    if(d.selectType)   setSelectType(d.selectType);
    if(d.selectionArr) setSelection(d.selectionArr);  
    if(d.annotations)  setAnnotations(d.annotations);
  }
  useEffect(() => {
    firebase.addListener(data => onFirebaseUpdate(data));
  }, []);


  return (
    <Box display='flex'>
      <AppBar>
        <Box display='flex' flexDirection='row' width='100%' height='100%' justifyContent='space-between' alignItems='center'>
          <p>{conductor?'CONDUCTOR':''}</p>
          <Box display='flex' flexDirection='row'>
            <h1 onClick={e => setScore()} style={{cursor:'pointer'}}>Score Share</h1>
            <h2 style={{marginLeft: 40}}>Trompa</h2>
          </Box>
          <Box>
            <Button onClick={e => switchType()} style={{color:'white'}}>
              {`Type: ${TYPES[selectType]}`}
            </Button>
          </Box>
        </Box>
      </AppBar>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' minHeight='100vh' width='100vw' overflow='auto' marginTop='100px'>
        {!score && conductor && (
          <>
            <Button variant='contained' size='large' onClick={e => setDialog(DIALOG_SHEET)}>Load a score</Button>
            <Button variant='contained' size='small' onClick={e => loadAudio('example')} style={{marginTop:40}}>Load some audio</Button>
          </>
        )}
        {!score && !conductor && (
          <h5>Wait for conductor to load score</h5>
        )}
        {audio && 
          <BeatAnnotator firebase={firebase} conductor={conductor}/>
        }
        {score && 
          <ScoreContainer 
            uri={score.source} 
            conductor={conductor}
            selectionType={`.${TYPES[selectType]}`} 
            selection={selection} 
            onSetSelection={selection => onSetSelection(selection)}
            annotations={annotations}
            onSetAnnotation={a => onSetAnnotation(a)}
            removeAnnotation={(i) => removeAnnotation(i)} 
          />
        }
      </Box>
      <Dialog open={dialog !== false}>
        <Box display='flex' flexDirection='row' width='100%' justifyContent='space-between'>
          <p>&nbsp;</p>
          <h3>Select a score from CE</h3>
          <Button onClick={e => setDialog(false)}>X</Button>
        </Box>
        <div style={{ overflow:'auto', border:'1px solid' }}>
          <MultiModalComponent filterTypes={dialog === DIALOG_SHEET? ['DigitalDocument']:['AudioObject']} 
            onResultClick={node => loadCENode(node)} disableFilters />
        </div>
        <Button onClick={e => loadCENode(demo)}>Local demo score</Button>
        {score && (
          <div id='scoreContainer' style={{padding:30}}>
            <h3>Score</h3>
            <p>{`Will load: ${score.creator} - ${score.name}`}</p>
            <p style={{fontSize:'0.7em'}}>{`Source: ${score.source}`}</p>
            <br/>
          </div>
        )}
      </Dialog>
    </Box>
  )
}
const isMei   = node => 
  node.source.lastIndexOf('.mei') === node.source.length-4;
const isAudio = node => 
  node.source.lastIndexOf('.wav') === node.source.length-4 || 
  node.source.lastIndexOf('.mp3')  === node.source.length-4;