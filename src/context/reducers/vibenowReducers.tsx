const vibenow = (state: any, {type, payload}: any) => {
  switch (type) {
    case 'UPDATE_OTP':
      return payload;
    case 'GET_MODE':
      return payload;
    case 'GET_INTERST':
      return payload;
    case 'GET_Theme':
      return payload;
    case 'changeModeId':
      return payload;
    case 'ProfileMatch':
      return payload;
    default:
      return state;
  }
};

export default vibenow;
