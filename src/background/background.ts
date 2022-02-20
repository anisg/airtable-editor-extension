const fmtUidv4 = (i) =>
  i.substr(0, 8) +
  "-" +
  i.substr(8, 4) +
  "-" +
  i.substr(12, 4) +
  "-" +
  i.substr(16, 4) +
  "-" +
  i.substr(20);

function promisify(fn, options) {
  return new Promise((accept, cancel) => {
    fn(options, accept);
  });
}
async function getNotionToken() {
  const cookie = (await promisify(chrome.cookies.get, {
    url: "https://www.notion.so",
    name: "token_v2",
  })) as any;
  if (!cookie) {
    return null;
  }
  return cookie.value;
}

async function getNotionUserId() {
  const cookie = (await promisify(chrome.cookies.get, {
    url: "https://www.notion.so",
    name: "notion_user_id",
  })) as any;
  if (!cookie) {
    return null;
  }
  return cookie.value;
}

async function getNotionSpaceId() {
  const cookie = (await promisify(chrome.cookies.get, {
    url: "https://www.notion.so",
    name: "ajs_group_id",
  })) as any;
  if (!cookie) {
    return null;
  }
  let de = decodeURI(cookie.value);
  return de.includes('"') && fmtUidv4(de.match(/"(.*?)"/)[1]);
}

async function asyncResponse(msg, fn, sendResp) {
  try {
    let data = await fn();
    sendResp({ data, success: true });
  } catch (e) {
    console.log("failed to get", msg, e);
    sendResp({ success: false, data: null });
  }
}

let actions = {
  getNotionCredentials: async () => {
    let token = await getNotionToken();
    let userId = await getNotionUserId();
    // let spaceId = await getNotionSpaceId();
    if (token && userId) {
      return {
        token,
        userId,
        // ,spaceId
      };
    }
  },
};

chrome.runtime.onMessage.addListener(function (rq, sender, sendResponse) {
  // setTimeout to simulate any callback (even from storage.sync)
  console.log("onMessage:", rq);
  if (rq.type == "executeBackgroundAction") {
    if (typeof rq.action != "string") {
      throw "not implemented";
    }
    let action = typeof rq.action == "string" && rq.action;
    if (action in actions) {
      asyncResponse(action, actions[action], sendResponse);
      return true;
    }
  }
  return null;
});

function install_notice() {
  if (localStorage.getItem("install_time")) return;

  var now = new Date().getTime();
  localStorage.setItem("install_time", `${now}`);
  chrome.tabs.create({
    url:
      "https://www.notion.so/Notion-Time-Tracker-Tutorial-972c37bf45e9409baa36e9cf66874a52",
  });
}
install_notice();
