
const CurrentDate = (props) => {
  return (
    <div>
      { /* change code below this line */ }
      {/*added extra var to help me understand what's going on*/}
      <p>The current date is: {props.date}{props.extraVar}</p>
      { /* change code above this line */ }
    </div>
  );
};

class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3>What date is it?</h3>
        { /* change code below this line */ }
        {/* addign something to extravar*/}
        <CurrentDate date={Date()} extraVar = {"waka"}/>
        { /* change code above this line */ }
      </div>
    );
  }
};
