import React from "react";

class CountDownTimer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      time: 4,
      start: 0,
      isOn: false
    }

  }

  tick() {
    const timing = this.state.time;

    timing > 0 && this.setState({
      time: this.state.time - 1
    });
  }


  componentDidMount() {
    console.log("start")
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }


  getNewCode = (e) => {
   e.preventDefault();
   console.log('new code');
   this.resetTimer();
  }

  resetTimer = () => {
    this.props.getNewCode();
    this.setState({time: 5});
  }

  render() {
    const timing = this.state.time;
    const waitLine = <p className='code-returning-time-p'>Запросить новый код можно через 00:{timing}</p>;
    const getCodeLine = <p onClick={this.getNewCode} className='code-returning-time-p'>Получить новый код</p>;
    const result = (timing > 0) ? waitLine : getCodeLine;
    return(
       <div>
        {result}
       </div>
    )
  }
}
export default CountDownTimer;
