const defaultState = {
  login: false
};

const reducer = (state = defaultState, action) => {
  // change code below this line
  //console.log(action)
  //console.log()
  if(action.type == 'LOGIN'){
    //console.log(state.login);
    //console.log(state.login);
    return {login:true};
  }
  else{
    return state;
  }
  // change code above this line
};

const store = Redux.createStore(reducer);

const loginAction = () => {
  return {
    type: 'LOGIN'
  }
};
