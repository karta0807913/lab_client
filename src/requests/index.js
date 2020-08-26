let HOST_URL = "";
if (process.env.REACT_APP_HOST_URL) {
    if (process.env.REACT_APP_HOST_URL[process.env.REACT_APP_HOST_URL.length - 1] !== "/") {
        HOST_URL = process.env.REACT_APP_HOST_URL + "/";
    }
} else {
    HOST_URL = "http://127.0.0.1/";
}

export function concat_url(path) {
    if (path[0] === "/") {
        path = "." + path;
    }
    let url = new window.URL(path, HOST_URL);
    return url;
}

function send(path, args) {
    args = args || {};
    let url = concat_url(path);
    return new Promise((res, rej) => {
        fetch(url.toString(), {
            credentials: "include",
            ...args
        }).then(async (context) => {
            let data = await context.text();
            try {
                let response = JSON.parse(data);
                if (context.ok) {
                    res(response);
                } else {
                    rej(response);
                }
            } catch (error) {
                rej(data);
            }
        }).catch(rej);
    });
}

function post(path, data = {}) {
    if (typeof data !== "string") {
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

function get(path, data = {}) {
    let url = concat_url(path);
    for (var key in data) {
        url.searchParams.set(key, data[key]);
    }
    return send(url.toString(), {
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

export function sign_up(nickname, account, password) {
    return post("/api/sign_up", {
        name: nickname,
        account, password
    });
}

export function me() {
    return get("/member/me");
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

export function user_info(id) {
    return get("/member/user", {
        user_id: id
    });
}

export function logout() {
    return get("/member/logout", {
    });
}