export const parseErrorResponse = (error: any) => {
  if (error?.response) {
    console.log(error.response);
    return error.response;
  }
  console.log(error);
  return error;
};
