const defaultState = {
  authenticated: false
};

const authReducer = (state = defaultState, action) => {
  // change code below this line
  //console.log("state = " +state)
  switch(action.type){
    case 'LOGIN':
      //console.log("login = " + action.type)
      return {authenticated: true}
    case 'LOGOUT':
      //console.log("logout = " + action.type)
      return {authenticated: false}
    default:
      state.authenticated = false;
      return state;
  }
  // change code above this line
};

const store = Redux.createStore(authReducer);

const loginUser = () => {
  return {
    type: 'LOGIN'
  }
};

const logoutUser = () => {
  return {
    type: 'LOGOUT'
  }
};
