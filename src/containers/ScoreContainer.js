import React, { useState } from 'react';

import NextPageButton from 'selectable-score/lib/next-page-button.js';
import PrevPageButton from 'selectable-score/lib/prev-page-button.js';
import SelectableScore from "./SelectableScore";
import { Box, Button, Card, Paper, TextField, Divider } from '@material-ui/core';

export default function ScoreContainer (props) { 
  const { uri, conductor, selectionType, selection, onSetSelection, annotations, onSetAnnotation, removeAnnotation } = props;
  const selectedItems = selection? selection.map(i => document.getElementById(i)) : [];

  //Recieves selected items, now send the id's up
  const onSetSelectedItems = items => onSetSelection(items.map(i => i.id));

  return( 
    <Box display='flex' flexDirection='row' >
      {/* <History history={selectionHistory} onRunHistory={i => onRunHistory(i)} /> */}
      <Paper style={{maxHeight:'100%', padding:20 }}>
        <div style={{display:'flex', flexDirection:'row' }}>
          <h4>Page</h4>
          <Button>
            <PrevPageButton
              buttonContent={<span>prev</span>}
              uri={uri} />
          </Button>
          <Button>
            <NextPageButton
              buttonContent={<span>next</span>}
              uri={uri}/>
          </Button>
        </div>
        <SelectableScore
          uri={uri} 
          selectTypeString={selectionType}
          externalSelection={selectedItems}
          onSetSelectedItems={items => onSetSelectedItems(items)} 
          // onScoreUpdate = {elem => console.log('Recieved update for', elem)}
        />
      </Paper>
      <Box style={{minWidth:330 }}>
        {(annotations.length > 0 || selection.length > 0) && 
          <Box display='flex' flexDirection='column' style={{marginLeft:30}}>
            <Paper style={{minHeight:200, padding: 20}}>
              <Box>
                <h4>{conductor? "Annotate to selection":"Annotations"}</h4>
                <Divider />
                {selection.length > 0 &&
                  <Annotate
                    conductor={conductor} 
                    annotations={filterAnnotationsToSelection(annotations, selection)}
                    onSetAnnotation={onSetAnnotation}
                    removeAnnotation={(i) => removeAnnotation(i)}
                  />
                }
              </Box>
            </Paper>
            {annotations.length > 0 &&
              <Box style={{padding: 20}}>
                <h4>All annotations</h4>  
                <Divider />
                <AnnotationList 
                  conductor={conductor}
                  annotations={annotations} 
                  removeAnnotation={(i) => removeAnnotation(i)} />
              </Box>
            }
          </Box>
        }
      </Box>
    </Box>
  );
}
const filterAnnotationsToSelection = (arr, sel) => {
  // arr = arr.map(a => {
  //   if(a.target.some(t => {
  //       return sel.includes(t.id.substring(t.id.lastIndexOf("#")+1));
  //   }))
  //   return a;
  // });
  // console.log(arr);
  // return arr;

  const ret = [];
  arr.forEach(anno => {
    let found = false;
    anno.target.forEach(target => {
      const id = target.id.substring(target.id.lastIndexOf("#") + 1);
      if(sel.includes(id)) {
        // if(!found) found = [];
        // found.push(target);
        found = true;
      }
    });
    if(found) {
      // anno.target = found;
      ret.push(anno);
    }
  });
  return ret;
}
const AnnotationList = props => {
  const { conductor, annotations, removeAnnotation } = props;
  if(!annotations) return "";
  else return (
    <Card style={{maxHeight:400, overflow:'auto', fontWeight:'bold', padding:20}}>
      {annotations.map((a,i) => (
        <Box key={i}>
          <Box key={i} display='flex' flexDirection='row' justifyContent='space-between'>
            <p>{a.body[0].value}</p>
            {conductor && 
              <Button onClick={e => removeAnnotation(i)}>x</Button>
            }
          </Box>
          <Box style={{paddingLeft:30, fontSize:'0.8rem', lineHeight:'0.8rem', fontWeight:'normal', maxWidth:'280px'}}>
            {a.target.map((t,j) => (
              <p key={`${i}.${j}`}>{`${t.id.substring(t.id.lastIndexOf("#") + 1)}`}</p>
            ))}
          </Box>
        </Box>
      ))}
    </Card>
  );
}
const Annotate = props => {
  const { conductor, annotations, onSetAnnotation, removeAnnotation } = props;
  const [value, setValue]                = useState('');
  
  // const anno = annotations && annotations.length > 0? annotations[0] : null;
  // console.log('annotate, list?', annotations);

  const submitValue = () => {
    onSetAnnotation(value);
    setValue('');
  }
  const keyDown = e     => {
    e.persist();
    if(e.keyCode === 13) submitValue();
  }
  return (
    <>
      <Box style={{padding: 30, maxHeight: 200, overflow:'auto', borderTop:'1px solid gray'}}>
        {conductor && 
          <>
            <TextField 
              label="Annotation" 
              variant='outlined' 
              value={value} 
              width='100%'
              onChange={e  => setValue(e.target.value)} 
              // onBlur={e    => submitValue()}
              onKeyDown={e => keyDown(e)}
            />
            <Button onClick={e => submitValue()}>+</Button>
          </>
        }
      </Box>
      <AnnotationList 
        conductor={conductor}
        annotations={annotations}
        removeAnnotation={(i) => removeAnnotation(i)} />
    </>
  );
}

