let HOST_URL = "";
if (process.env.REACT_APP_HOST_URL) {
  if (process.env.REACT_APP_HOST_URL[process.env.REACT_APP_HOST_URL.length - 1] !== "/") {
    HOST_URL = process.env.REACT_APP_HOST_URL + "/";
  }
} else {
  HOST_URL = "http://127.0.0.1/";
}

function concat_url(path) {
  if (path[0] === "/") {
    path = "." + path;
  }
  let url = new window.URL(path, HOST_URL);
  return url;
}

async function send(path, args) {
  args = args || {};
  let url = concat_url(path);
  let result = await fetch(url.toString(), {
    credentials: "include",
    ...args
  });
  if (result.status !== 200) {
    throw await result.json();
  }
  return await result.json();
}

function post(path, data, method = "POST") {
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }
  return send(path, {
    body: data,
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

async function get(path, data) {
  let url = concat_url(path);
  for (var key in data) {
    if (data[key] !== undefined) {
      url.searchParams.set(key, data[key]);
    }
  }
  let result = await fetch(url.toString(), {
    credentials: "include",
  });
  if (result.status !== 200) {
    throw await result.json();
  }
  return await result.json();
}

export function login(account, password) {
  return post("/api/login", {
    account: account,
    password: password
  });
}

export function user_info() {
  return get("/member/me");
}

export function file_list() {
  return get("/file/list");
}

export function get_file(id) {
  return get("/file/get", { id: id });
}

export function upload_file(file_info, blob) {
  let formData = new FormData();
  let context = new Blob([JSON.stringify(file_info)], {
    type: "application/json"
  });
  formData.append("info", context);
  formData.append("file", blob);
  return send("/file/upload", {
    body: formData,
    method: "POST",
    headers: {
      Accept: 'application/json',
    },
  });
}

export async function new_blog(title, context, tag_list = [], file_list = []) {
  let blog = await post("/blog/blog", {
    title, context, file_list
  });
  let id = blog.blog_id;
  let promise_list = [];
  for (let tag_id of tag_list) {
    promise_list.push(add_blog_tag(id, tag_id));
  }
  blog.tag_list = await Promise.all(promise_list);
  return blog;
}

export function update_blog(blog_id, title, context, tag_list, file_list) {
  return post("/blog/blog", {
    blog_id, title, context, tag_list, file_list
  }, "PUT");
}

export function get_blog(blog_id) {
  return get("/blog/get", {
    blog_id
  });
}

export function list_blog(limit = 20, offset = 0, { title, owner_id } = {}) {
  return get("/blog/list", {
    title, owner_id, limit, offset
  });
}

export function delete_blog(blog_id) {
  return post("/blog/blog", { blog_id }, "DELETE");
}

export function homepage() {
  return get("/api/homepage");
}

export function list_tag() {
  return get("/blog/tag");
}

export function new_tag(name) {
  return post("/blog/tag", { name });
}

export function modify_tag(id, name) {
  return post("/blog/tag", { id, name }, "PUT");
}

export function search_blog_tag(tag_list) {
  return get("/blog/blog_tag", { tag_id: tag_list });
}

export function add_blog_tag(blog_id, tag_id) {
  return post("/blog/blog_tag", { blog_id, tag_id });
}

export function delete_blog_tag(blog_id, tag_id) {
  return post("/blog/blog_tag", { blog_id, tag_id }, "DELETE");
}