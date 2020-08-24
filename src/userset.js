import * as request from "./requests";

const userset = new Map();

export async function getUser(id) {
  let user = userset.get(id);
  while (user) {
    try {
      return await user;
    } catch (error) {
    }
    user = userset.get(id);
  }
  let promise = new Promise(async (res, rej) => {
    try {
      let response = await request.user_info(id);
      res(response);
    } catch (error) {
      console.log(error);
      rej(error);
      userset.delete(id);
    }
  });
  userset.set(id, promise);
  return promise;
}
