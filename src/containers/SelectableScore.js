import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import Score from 'meld-clients-core/lib/containers/score';
import DragSelect from "dragselect/dist/DragSelect";
import ReactDOM from 'react-dom';

const OPTIONS = {
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 1800,
  footer: "none",
  unit: 6
}

class SelectableScoreOld extends Component {
  constructor(props) { 
    super(props);
    this.state = { 
      scoreComponentLoaded: false,
      selection:[],
    }
    this.enableSelector = this.enableSelector.bind(this);
    this.scoreComponent = React.createRef();
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.observer = new MutationObserver(this.handleScoreUpdate);
  }

  handleScoreUpdate() { 
    const tellProp = this.props.onScoreUpdate?.(ReactDOM.findDOMNode(this.scoreComponent.current).querySelector("svg"));
  }
  selectFromProps() {
    // console.log("SELECT FROM PROPS", this.props.externalSelection, this.state.selection);
    this.state.selection.forEach(elem         => {
      if(elem) elem.classList.remove('selected');
    });
    this.props.externalSelection.forEach(elem => {
      if(elem){   //TODO: Sometimes a null element comes through
        if(elem.classList) elem.classList.add('selected');
      }
    });
    this.setState({selection:this.props.externalSelection});
  }
  enableSelector() {
    if(!Object.keys(this.props.score.SVG).length)  console.log("Enable selector called before MEI has loaded!");

    if (this.state.selector) this.state.selector.stop();

    let selector = new DragSelect({
      selectables: document.querySelectorAll(this.props.selectTypeString),
      area: document.getElementsByClassName('score')[0],
      selectedClass: 'selected',
      onDragStartBegin: () => {
        this.state.selection.forEach(elem => elem.classList.remove('selected'));
        document.body.classList.add('s-noselect');
      },
      callback: (elements) => {
        document.body.classList.remove('s-noselect');
        this.setState({selection:elements});
        this.props.onSetSelectedItems(elements);
      }
    });
    this.setState({selector: selector});
  }
  
  componentDidMount() { 
    setTimeout(() => {
      this.enableSelector();
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.scoreComponentLoaded && this.scoreComponent.current) { 
      this.setState({ "scoreComponentLoaded": true }, () => { 
        this.observer.observe(ReactDOM.findDOMNode(this.scoreComponent.current).querySelector(".score"), {"childList": true});
      })
    }
    if(prevProps.score.latestRenderedPageNum !== this.props.score.latestRenderedPageNum)  
      this.enableSelector();
    
    if(prevProps.selectTypeString !== this.props.selectTypeString)
      this.enableSelector();
    
    if(prevProps.externalSelection !== this.props.externalSelection){
      if(this.props.externalSelection) this.selectFromProps();
    }
  }

  render() { 
    return(
      <Score 
        uri={ this.props.uri }
        key={ this.props.uri }
        options={ OPTIONS }
        ref = { this.scoreComponent }
        // scoreAnnotations={this.props.annotations}
      />
    )
  }
}

function mapStateToProps({ score }) {
  return { score }
}

export default connect(mapStateToProps,)(SelectableScoreOld);