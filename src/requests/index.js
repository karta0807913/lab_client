let HOST_URL = "";
if(process.env.REACT_APP_HOST_URL) {
  if(process.env.REACT_APP_HOST_URL[process.env.REACT_APP_HOST_URL.length - 1] !== "/") {
    HOST_URL = process.env.REACT_APP_HOST_URL + "/";
  }
} else {
  HOST_URL = "http://127.0.0.1/";
}

function concat_url(path) {
  if(path[0] === "/") {
    path = "." + path;
  }
  let url = new window.URL(path, HOST_URL);
  return url;
}

function send(path, args) {
  args = args || {};
  let url = concat_url(path);
  return fetch(url.toString(), {
    credentials: "include",
    ...args
  });
}

function post(path, data) {
  if(typeof data !== "string") {
    data = JSON.stringify(data);
  }
  return send(path, {
    body: data,
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

function get(path, data) {
  let url = concat_url(path);
  for(var key in data) {
    url.searchParams.set(key, data[key]);
  }
  return fetch(url.toString(), {
    credentials: "include",
  });
}

export function login(account, password) {
  return post("/api/login", {
    account: account,
    password: password
  });
}

export function file_list() {
  return get("/file/list");
}

export function get_file(id) {
  return get("/file/get", { id: id });
}