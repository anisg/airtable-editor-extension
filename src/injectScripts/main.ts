function println(...args: any[]): any {
  //hide on prod
  return console.log(...args);
}

// @ts-ignore
function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
const jparse = (v: any) => JSON.parse(v);
const jstringify = (v: any) => JSON.stringify(v);

function debounce(func: (...args) => any, wait, immediate = false, context?) {
  var result;
  var timeout = null;
  return function (...args) {
    var later = function () {
      timeout = null;
      if (!immediate) result = func(...args);
    };
    var callNow = immediate && !timeout;
    // Tant que la fonction est appelée, on reset le timeout.
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func(...args);
    return result;
  };
}

const AppStorage = {
  get<T>(k, defaultValue: T = null): Promise<T> {
    return new Promise((accept) => {
      chrome.storage.local.get([k], function (result) {
        // println('result', result);
        accept((result[k] && jparse(result[k])) || defaultValue);
      });
    });
  },
  set: async (k, v) => {
    return new Promise((accept) => {
      chrome.storage.local.set({ [k]: jstringify(v) }, function () {
        accept(true);
      });
    });
  },
};
function r2a<T>(record: Record<any, T>): T[] {
  return Object.keys(record).map((k) => record[k]);
}

function a2r<T>(arr: T[], key: string): Record<any, T> {
  let m = {};
  arr.forEach((e) => {
    m[e[key]] = e;
  });
  return m;
}

async function executeBackgroundAction(action: "getNotionCredentials") {
  return new Promise((accept) => {
    chrome.runtime.sendMessage(
      { type: "executeBackgroundAction", action },
      (resp) => {
        println("executeBackgroundAction", action, resp);
        accept(resp.data);
      }
    );
  });
}

function promisify(fn, options) {
  return new Promise((accept, cancel) => {
    fn(options, accept);
  });
}
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jdump = (obj: any) => JSON.stringify(obj, null, 2);

function isNotionDarkTheme() {
  return document.querySelector("body.notion-body.dark") != null;
}

function extractNumberProperties(): {
  propertyName: string;
  propertyEl: Element;
  dragHandleEl: Element;
  fieldEl: Element;
}[] {
  // println(">>R", document.querySelectorAll("svg.typesNumber"));
  const svgs = [
    ...document.querySelectorAll(
      ".notion-scroller > div:nth-child(2) svg.typesNumber"
    ),
  ];
  println("svgs", svgs);
  return svgs.map((svg) => {
    const r = svg.parentNode.parentNode;
    const dragHandleEl = r.parentNode.parentNode.children[0];
    // println(">>",r);
    const fieldEl = dragHandleEl.parentNode.parentNode.children[1];
    return {
      propertyEl: r.parentNode as any,
      propertyName: r.children[1].textContent,
      dragHandleEl: dragHandleEl,
      fieldEl,
    };
    //
  });
}

const style = `

.chrono-text {
    margin-left: 10px;
  }

.sym-chrono {
   
  }
`;

const getNumberFieldAtZero = () => `
<div class="hidden" style="display: flex; height: 100%; flex: 1 1 auto;">
    <div class="" role="button" tabindex="0"
        style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: flex; align-items: center; border-radius: 3px; width: 100%; min-height: 34px; padding: 6px 8px 7px; font-size: 14px; overflow: hidden;">
        <span style="line-height: 1.5; word-break: break-word; white-space: pre-wrap; pointer-events: none;">0</span>
    </div>
</div>
`;

const getChronoInput = ({ isDark }) => `
<div style="position: absolute; top: 0px;left:0px;width:100%;height:100%; pointer-events: auto;z-index:150;">
  <div
    style="display: flex; align-items: center; position: relative; flex-direction: column-reverse; transform-origin: 0% top; left: 0px; top: 0px;">
    <div
      style="border-radius: 3px; background: ${
        isDark ? "rgb(63, 68, 71)" : "white"
      }; width:100%; box-shadow: ${
  isDark
    ? "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px"
    : "rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px"
}; overflow: hidden;">
      <div
        style="display: block; align-items: center; border: none; padding: 6px 9px; width: 100%; background: transparent; font-size: 14px; line-height: inherit; min-height: 34px;">
        <input type="text" class=""
          style="font-size: inherit; line-height: inherit; border: none; background: none; width: 100%; display: block; resize: none; padding: 0px; text-align: left;">
      </div>
    </div>
  </div>
</div>
`;
const getChronoInputOutside = ({}) => `
<div style="
    position: fixed;
    z-index:149;
    top: 0px;
    left: 0px;
    width: 100%;
    /*background: rgb(0,0,255,0.2);*/
    height: 100%;
    cursor: default;
"></div>
`;
const getChronoHtml = ({ isDark }) => `
<div
style=" position:relative; display: flex; align-items: center; margin-left: 4px; height: 100%; flex: 1 1 auto; min-width: 0px;"
>
<div class="" role="button" tabindex="0" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: flex; align-items: center; border-radius: 3px; width: 100%; min-height: 34px; padding: 6px 8px 7px; font-size: 14px; overflow: hidden; color: ${
  isDark ? "rgba(255, 255, 255)" : "rgb(55,53,47)"
};">
<div style=" display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    padding: 0px;
    width:100%;
    justify-content:space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;">    
        <div className="sym-chrono" style=" display: -webkit-box;
            display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;">
    <img src="${chrome.runtime.getURL(
      "./images/mt-timer.svg"
    )}" loading="lazy" width="18" alt=""/><img id="chrono-status-img" src="${chrome.runtime.getURL(
  "./images/start-icon.svg"
)} "loading="lazy" style="margin-left:2px;" width="18" alt=""/>
      <div id="chrono-text" style="margin-left:2px;">12:10</div>
    </div>
    <div class="chrono-edit-btn"
    
    style="
    opacity:0;
    padding: 3px 3px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    ">
        <img src="${chrome.runtime.getURL(
          "./images/mt-edit.svg"
        )}" loading="lazy" width="16" alt=""/>
    </div>
    </div>
    </div>
    </div>
    `;
const getContextMenuItemHtml = ({ action }) => `
<div
    style="padding-top: 6px; padding-bottom: 6px; box-shadow: rgba(255, 255, 255, 0.07) 0px -1px 0px; margin-top: 1px;">
    <div role="button" tabindex="0"
        style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; width: 100%;">
        <div
            style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 28px; font-size: 14px;">
            <div style="display: flex; align-items: center; justify-content: center; margin-left: 14px;">
                <div style="display: flex; align-items: center; justify-content: center;"><img src="${chrome.runtime.getURL(
                  "./images/mt-timer.svg"
                )}" loading="lazy" width="18" alt=""/></div>
            </div>
            <div style="margin-left: 8px; margin-right: 14px; min-width: 0px; flex: 1 1 auto;">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${action}</div>
            </div>
        </div>
    </div>
</div>
`;

type ID = string;
async function getNotionApi() {
  let resp: { token; userId } | null = (await executeBackgroundAction(
    "getNotionCredentials"
  )) as any;
  if (!resp) return null;
  return new NotionV3Client(resp);
}
function buildOperation(param: {
  id: ID;
  command?: "set" | "update" | "listAfter" | "listRemove";
  table?: "collection" | "block";
  args?: any;
  path?: string[];
}) {
  param = {
    ...{ table: "block", path: [], args: {}, command: "set" },
    ...param,
  };
  //if (type(path) == "string") path = path.split(".");
  return {
    id: param.id,
    path: param.path,
    args: param.args,
    command: param.command,
    table: param.table,
  };
}

class NotionV3Client {
  token: string;
  userId: string;
  defaultHeaders = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    origin: "https://www.notion.so",
    referer: "https://www.notion.so",
  };
  async _axios(
    route: string,
    method: "post" | "get" | "delete" | "put" = "get",
    data = {},
    headers = {}
  ) {
    //check can still fetch (rate limit)
    let res;
    res = await fetch(
      `https://www.notion.so/api/v3/${
        (route.startsWith("/") && route.slice(1)) || route
      }`,
      {
        method: method.toUpperCase(),
        headers: {
          "content-type": "application/json",
          ...this.defaultHeaders,
          ...(this.token && { cookie: `token_v2=${this.token}` }),
          ...headers,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  }

  post(route, data = {}, headers = {}) {
    return this._axios(route, "post", data, headers);
  }

  put(route, data = {}, headers = {}) {
    return this._axios(route, "put", data, headers);
  }

  delete(route) {
    return this._axios(route, "delete");
  }

  get(route) {
    return this._axios(route, "get", null);
  }

  constructor({ token, userId }) {
    this.token = token;
    this.userId = userId;
  }

  // addWebClipperURLs(
  //   d: NotionAddWebClipperURLsParams
  // ): Promise<NotionAddWebClipperURLsResp> {
  //   return this.post("/addWebClipperURLs", d)
  // }
  getPublicPageData(d: {
    type: "block-space";
    name: "page";
    blockId: ID;
    showMoveTo: false;
    saveParent: false;
  }): Promise<{
    spaceName: "My Workspace";
    spaceId: ID;
    canJoinSpace: true;
    userHasExplicitAccess: true;
    hasPublicAccess: false;
    collectionId?: ID;
    collectionFormat: {
      collection_page_properties: { visible: true; property: ID }[];
      property_visibility: {
        property: "FrCO";
        visibility: "show" | "hide" | "hide_if_empty";
      }[];
    };
    collectionSchema: Record<string, any>;
    betaEnabled: false;
    canRequestAccess: true;
  }> {
    return this.post("/getPublicPageData", d);
  }

  custom = {
    updateNumberProperty: async ({
      pageId,
      propertyId,
      value,
    }: {
      pageId: string;
      propertyId: string;
      value: number;
    }) => {
      // function createRecordOperation(userId) {
      //     let args = {
      //         id: recordId,
      //         version: 1,
      //         alive: true,
      //         created_by: userId,
      //         created_time: Date.now(),
      //         last_edited_time: Date.now(),
      //         parent_id: collectionId,
      //         parent_table: "collection",
      //         // ...extra,
      //     }
      //     return {
      //         id: recordId,
      //         operations: [
      //             buildOperation({ id: recordId, command: "update", args, table:"block" }),
      //         ],f
      //     }
      // }

      // let pointer = { "table": "block", "id": pageId };

      // let operation =
      // { "pointer": pointer,
      // "path": ["properties", propertyId],
      // "command": "set", "args": [[String(value)]],
      // }
      // let opLastEditedTime = { "pointer": pointer, "path": ["last_edited_time"], "command": "set", "args": Date.now() }

      // let request = {
      //     requestId: uuidV4(),
      //     transactions: [{
      //         id: uuidV4(),
      //         spaceId:this.spaceId,
      //         operations: [operation,opLastEditedTime],
      //     }
      //     ],
      // }
      // const resp = await this.post("/saveTransactions", request)

      let operation = {
        id: pageId,
        command: "set",
        table: "block",
        path: ["properties", propertyId],
        args: [[String(value)]],
      };

      let request = {
        requestId: uuidV4(),
        transactions: [
          {
            id: uuidV4(),
            operations: [operation],
          },
        ],
      };
      const resp = await this.post("/submitTransaction", request);
      println("response", resp);
      // const recordOp = createRecordOperation(this.userId);
      // println("got", recordOp);
    },
    //   createWebClippedPage: async (
    //     parentId: ID,
    //     { title, url }: { title: string; url: string }
    //   ) => {
    //     const x = await this.addWebClipperURLs({
    //       blockId: parentId,
    //       items: [{ title, url }],
    //       from: "chrome",
    //       type: "block",
    //     })
    //     return x.createdBlockIds[0]
    //   },

    //   getSpaceIds: async () => {
    //     const res = await this.post("/getSpaces")
    //     let spaceViewsMap = {}
    //     Object.keys(res).forEach((id) => {
    //       spaceViewsMap = { ...spaceViewsMap, ...(res[id]?.space_view || {}) }
    //     })
    //     let spaceIds = Object.keys(spaceViewsMap)
    //       .map((k) => {
    //         let b = spaceViewsMap[k]
    //         return b.value?.space_id
    //       })
    //       .filter((e) => e != null)
    //     return spaceIds
    //   },

    //   getUsers: async () => {
    //     const res = await this.post("/getSpaces")
    //     let usersMap: Record<
    //       string,
    //       { email: string; spaceIds: string[]; id: string }
    //     > = {}
    //     Object.keys(res).forEach((userId) => {
    //       let user = res[userId].notion_user[userId]?.value || { id: userId }
    //       usersMap[userId] = {
    //         ...user,
    //         spaceIds: [],
    //       }
    //       usersMap[userId].spaceIds = Object.keys(
    //         res[userId]?.space_view || {}
    //       ).map(
    //         (spaceViewId) => res[userId]?.space_view[spaceViewId]?.value?.space_id
    //       )
    //     })
    //     let users = Object.keys(usersMap).map((k) => usersMap[k])
    //     return users
    //   },
  };
}

function htmlString2El(s) {
  var wrapper = document.createElement("div");
  wrapper.innerHTML = s;
  println("got", wrapper);
  return wrapper.children[0];
}

function fmtKeyProperty(collectionId, propertyId) {
  return `${collectionId}:${propertyId}`;
}
let t = null;
const saveAppData = debounce(() => {
  AppStorage.set("app", app);
}, 1000);

type ChronoState = {
  id: string;
  totalSec: number;
  status: "stopped" | "started";
  startedAt: string | null;
};
function getDefaultChronoStateData(
  propertyId,
  pageId,
  initialValue
): ChronoState {
  return {
    totalSec: initialValue,
    id: `${propertyId}:${pageId}`,
    status: "stopped",
    startedAt: null,
  };
}
const saveChronoState = debounce((chronoState: ChronoState) => {
  AppStorage.set(chronoState.id, chronoState);
}, 100);

function toHHMMSS(secs) {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}
async function syncNotionProperty({ pageId, propertyId, seconds }) {
  const notion = await getNotionApi();
  if (notion == null) {
    return fail("failed to fetch Notion, are you sure you are connected?");
  }
  notion.custom.updateNumberProperty({ pageId, propertyId, value: seconds });
}

function parseChronoFmtText(v) {
  let x = v
    .replace(/[^\d:]/g, "")
    .split(":")
    .reverse();
  let seconds = 0;
  if (x.length >= 3) {
    seconds += (parseInt(x[2]) || 0) * 3600;
  }
  if (x.length >= 2) {
    seconds += (parseInt(x[1]) || 0) * 60;
  }
  if (x.length >= 1) {
    seconds += parseInt(x[0]) || 0;
  }
  return seconds;
}

function getFullChrono(s) {
  let arr = s.split(":");
  if (arr.length == 2) {
    return "00:" + arr.join(":");
  }
  if (arr.length == 1) {
    return "00:00:" + arr.join(":");
  }
  return s;
}

class NumberProperty {
  isContextualMenuOpen: boolean;
  dragHandleEl: Element;
  fieldEl: Element;
  chronoEl: Element;
  chronoTextEl: Element;
  propertyEl: Element;
  chronoStatusImgEl: Element;
  activated: {
    isChronoActivate: boolean;
    propertyId: string;
    collectionId: string;
  };
  pageId: string;
  propertyName: string;
  intervalChrono: any;
  chronostate: ChronoState;
  constructor({
    dragHandleEl,
    propertyName,
    propertyEl,
    fieldEl,
    pageId,
    activated,
  }) {
    this.dragHandleEl = dragHandleEl;
    this.propertyName = propertyName;
    this.propertyEl = propertyEl;
    this.fieldEl = fieldEl;
    this.activated = activated;
    this.pageId = pageId;
    this.init();
  }
  _getChronoText() {
    let seconds;
    if (this.chronostate.status == "started")
      seconds = Math.floor(
        this.chronostate.totalSec +
          (Date.now() - new Date(this.chronostate.startedAt).getTime()) / 1000
      );
    else seconds = this.chronostate.totalSec;
    return toHHMMSS(seconds);
  }
  resumeChrono() {
    this.intervalChrono = setInterval(() => {
      this.chronoTextEl.innerHTML = this._getChronoText();
    }, 1000);
  }

  startChrono() {
    (this.chronoStatusImgEl as any).src = chrome.runtime.getURL(
      "./images/stop-icon.svg"
    );
    this.chronostate = {
      ...this.chronostate,
      status: "started",
      startedAt: new Date().toISOString(),
    };
    saveChronoState(this.chronostate);
    this.resumeChrono();
  }

  async stopChrono() {
    (this.chronoStatusImgEl as any).src = chrome.runtime.getURL(
      "./images/start-icon.svg"
    );
    // TODO: adding current time to property id of current page
    this.chronostate = {
      ...this.chronostate,
      status: "stopped",
      startedAt: null,
      totalSec: Math.floor(
        this.chronostate.totalSec +
          (Date.now() - new Date(this.chronostate.startedAt).getTime()) / 1000
      ),
    };
    clearInterval(this.intervalChrono);
    this.chronoTextEl.innerHTML = this._getChronoText();
    this.intervalChrono = null;
    saveChronoState(this.chronostate);

    syncNotionProperty({
      pageId: this.pageId,
      seconds: this.chronostate.totalSec,
      propertyId: this.activated.propertyId,
    });
  }

  toggleChrono() {
    if (this.chronostate.status == "started") {
      println("stop chrono");
      this.stopChrono();
    } else {
      println("start chrono");
      this.startChrono();
    }
  }

  async _displayInputField() {
    let isDark = document.querySelector("body.dark") != null;
    const inputFieldWrapper: any = htmlString2El(getChronoInput({ isDark }));
    const elOutside: any = htmlString2El(getChronoInputOutside({}));
    this.chronoEl.appendChild(inputFieldWrapper);
    this.chronoEl.appendChild(elOutside);
    const closeInputField = () => {
      console.log("close field");
      this.chronoEl.removeChild(elOutside);
      this.chronoEl.removeChild(inputFieldWrapper);
    };
    const saveAndCloseInputField = () => {
      const seconds = parseChronoFmtText(inputField.value);
      if (seconds == this.chronostate.totalSec) {
        closeInputField();
        return;
      }
      if (this.chronostate.status == "started") {
        this.chronostate.status = "stopped";
      }
      (this.chronoStatusImgEl as any).src = chrome.runtime.getURL(
        "./images/start-icon.svg"
      );
      this.chronostate.totalSec = seconds;
      this.chronoTextEl.innerHTML = this._getChronoText();
      saveChronoState(this.chronostate);
      syncNotionProperty({
        pageId: this.pageId,
        seconds: this.chronostate.totalSec,
        propertyId: this.activated.propertyId,
      });
      closeInputField();
    };
    elOutside.addEventListener("click", (ev) => {
      ev.stopPropagation();
      saveAndCloseInputField();
    });

    //attach now the state of inputField

    let inputField: HTMLInputElement = inputFieldWrapper.querySelector("input");
    inputField.value = getFullChrono(this._getChronoText());
    inputField.focus();
    inputField.onkeydown = (ev) => {
      if (
        ev.key in
        {
          ArrowUp: true,
          Backspace: true,
          ArrowDown: true,
          ArrowLeft: true,
          ArrowRight: true,
        }
      ) {
        ev.stopPropagation();
      }
      if (ev.key in { Escape: true, Tab: true, Enter: true }) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.key in { Tab: true, Enter: true, Escape: true }) {
          saveAndCloseInputField();
          // } else if (ev.key == "Backspace") {
          //     inputField.value = inputField.value.length && inputField.value.slice(0, inputField.value.length - 1) || ""
        }
      }
    };
    inputField.onkeypress = (ev) => {
      // console.log(inputField.value);
    };
  }

  async _attachChronometer() {
    println("ACTIVATING CHRONOMETER");
    let isDark = document.querySelector("body.dark") != null;
    const el: any = htmlString2El(getChronoHtml({ isDark }));
    let btn = el.children[0];
    let editBtn = el.querySelector(".chrono-edit-btn");
    let v = this.fieldEl.textContent;
    let initialValue =
      (v != "Empty" && Math.floor(parseFloat(v.replace(/[^\d.]/g, "")))) || 0;

    editBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      this._displayInputField();
      return false;
    });

    editBtn.addEventListener("mouseover", () => {
      editBtn.style.background = isDark
        ? "rgb(91,96,100)"
        : "rgb(55,53,47,0.16)";
    });
    editBtn.addEventListener("mouseout", () => {
      editBtn.style.background = null;
    });
    btn.addEventListener("mouseover", () => {
      btn.style.background = isDark ? "rgb(71,76,80)" : "rgb(55,53,47,0.08)";
      editBtn.style.opacity = 1;
    });
    btn.addEventListener("mouseout", () => {
      btn.style.background = null;
      editBtn.style.opacity = 0;
    });
    // this.fieldEl.innerHTML = "";
    //hiding the first child
    this.fieldEl.parentNode.insertBefore(el, this.fieldEl.nextSibling);
    this.fieldEl.classList.add("hidden");
    // println("hiding item", this.fieldEl.firstElementChild);
    // (this.fieldEl.firstElementChild as any)?.classList.add("hidden");
    // this.fieldEl.appendChild(el);
    // if (isEmpty) {
    //     let fieldElContent = htmlString2El(getNumberFieldAtZero());
    //     this.fieldEl.appendChild(fieldElContent);
    // }
    this.chronoEl = el;
    this.chronoTextEl = el.querySelector("#chrono-text");
    this.chronoStatusImgEl = el.querySelector("#chrono-status-img");
    this.chronoEl.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      this.toggleChrono();
    });

    //get current status
    this.chronostate = await AppStorage.get(
      `${this.activated.propertyId}:${this.pageId}`,
      getDefaultChronoStateData(
        this.activated.propertyId,
        this.pageId,
        initialValue
      )
    );
    if (
      this.chronostate.status == "stopped" &&
      initialValue != this.chronostate.totalSec
    ) {
      this.chronostate.totalSec = initialValue;
      saveChronoState(this.chronostate);
    }
    this.chronoTextEl.innerHTML = this._getChronoText();
    if (this.chronostate.status == "started") {
      (this.chronoStatusImgEl as any).src = chrome.runtime.getURL(
        "./images/stop-icon.svg"
      );
      this.resumeChrono();
    } else {
      (this.chronoStatusImgEl as any).src = chrome.runtime.getURL(
        "./images/start-icon.svg"
      );
    }
  }

  async _toggleChronometer() {
    if (this.activated?.isChronoActivate) {
      this.activated.isChronoActivate = false;
      if (this.chronostate && this.chronostate.status == "started") {
        await this.stopChrono();
      }
      // println("deactivating")
      app.propertiesMap[this.activated.propertyId] = {
        ...this.activated,
        isChronoActivate: false,
      };
      //refresh the page
      await AppStorage.set("app", app);
      setTimeout(() => {
        document.location.reload();
      }, 250);
    } else {
      app.propertiesCount++;
      const n = await getNotionPageInfo(this.pageId);
      if (n == null)
        return fail(
          "wasn't able to fetch database information, logout/login to Notion and try again. if it still doesn't work, contact the developer of the extension"
        );
      let propertyId = n.collectionSchemaName2Id[this.propertyName];
      let p = {
        isChronoActivate: true,
        propertyId: propertyId,
        collectionId: n.collectionId,
      };
      this.activated = p;
      app.propertiesMap[propertyId] = p;
      app.propertiesName2IdMap[this.propertyName] = propertyId;
      saveAppData();
      this._attachChronometer();
    }
  }

  _attachContextMenuToggle() {
    let numProperty = this;
    async function showToggleEvent() {
      println("received event listneter 'click'");
      await sleep(50);
      await repeatWhileNotTrue(
        () =>
          document.querySelector(
            ".notion-scroller.vertical .notion-focusable-within"
          ) != null,
        50,
        10000
      );
      const inp = document.querySelector(
        ".notion-scroller.vertical .notion-focusable-within"
      );
      if (!inp) {
        println("didnt found the contextual menu");
        return;
      }
      const contextMenu =
        inp.parentNode.parentNode.parentNode.parentNode.parentNode;
      const x = htmlString2El(
        getContextMenuItemHtml({ action: "toggle chronometer" })
      );
      // x.addEventListener("mouseover", ()=>{
      //     let isDark = document.querySelector("body.dark") != null;
      //     let black="rgb(76,71,80)"
      //     if (isDark){
      //     }
      // })
      // x.addEventListener("mouseout", ()=>{
      //     let isDark = document.querySelector("body.dark") != null;
      //     if (isDark){

      //     }
      // })
      x.children[0].addEventListener("click", () => {
        //1. toggle the current state of the chronometer via localStorage
        numProperty._toggleChronometer();
        //2. click outside the customizer page to trigger a close
        currentPage.isInPreview == false &&
          (document.querySelector(
            ".notion-overlay-container.notion-default-overlay-container"
          ).children[1]?.children[0]?.children[0] as any)?.click();
      });
      //adding the "toggle number"
      println("adding child", x);
      contextMenu.children[1].appendChild(x);
    }

    // this.dragHandleEl.children[0].addEventListener("click", showToggleEvent);
    // println("got",this.propertyEl);
    this.dragHandleEl.children[0].addEventListener("click", showToggleEvent);
    this.propertyEl.addEventListener("click", showToggleEvent);
  }

  init() {
    //add dragHandle contextMenuHandle
    this._attachContextMenuToggle();
    if (this.activated?.isChronoActivate) {
      this._attachChronometer();
    }
  }
}

function fail(msg) {
  println(msg);
  return null;
}

const fmtUid = (i) =>
  i.substr(0, 8) +
  "-" +
  i.substr(8, 4) +
  "-" +
  i.substr(12, 4) +
  "-" +
  i.substr(16, 4) +
  "-" +
  i.substr(20);
let numberPropertiesMap = {}; //by name
type App = {
  propertiesCount: number;
  propertiesMap: Record<
    ID,
    { collectionId: string; propertyId: string; isChronoActivate: boolean }
  >;
  propertiesName2IdMap: Record<string, ID>;
};
const defaultAppData: App = {
  propertiesCount: 0,
  propertiesMap: {},
  propertiesName2IdMap: {},
};
let app: App;

let currentPage = {
  isDatabaseItem: false,
  pageId: "",
  isInPreview: false,
  // collectionId: "",
  // collectionSchema: {},
  // collectionFormat: {},
  // collectionSchemaName2Id: {},
};

async function getCurrentPageInfo() {
  //get current page info from the api
  let url = new URL(window.location.href);
  let previewId = url.searchParams.get("p");
  currentPage.isInPreview = previewId != null;
  let v = window.location.pathname.split("-");
  let pageId = previewId || v[v.length - 1];
  if (!pageId) {
    return fail("failed to get current page id via the url");
  }
  currentPage.pageId = fmtUid(pageId);
}

async function getNotionPageInfo(
  pageId: string
): Promise<{
  collectionId: string;
  collectionSchemaName2Id: Record<string, any>;
}> {
  //get current page info from the api
  const notion = await getNotionApi();
  if (notion == null) {
    return fail("failed to fetch Notion, are you sure you are connected?");
  }
  const resp = await notion.getPublicPageData({
    type: "block-space",
    name: "page",
    blockId: pageId,
    showMoveTo: false,
    saveParent: false,
  });
  if (resp == null || resp.collectionId == null) return null;
  println(">>", resp);
  let ret = {
    collectionId: resp.collectionId,
    collectionSchema: resp.collectionSchema,
    collectionFormat: resp.collectionFormat,
    collectionSchemaName2Id: {},
  };
  //get extra info
  Object.keys(ret.collectionSchema).forEach((k) => {
    ret.collectionSchemaName2Id[ret.collectionSchema[k].name] = k;
  });
  return ret;
}

async function extractProperties() {
  extractNumberProperties().forEach((data) => {
    // println("attached event listener 'click'",data)
    if (data.propertyName in numberPropertiesMap) {
      println("already loaded: " + data.propertyName);
    }
    // if (!(data.propertyName in currentPage.collectionSchemaName2Id)) {
    //     println("property not found in db: " + data.propertyName);
    //     return;
    // }
    let activated = null;
    if (data.propertyName in app.propertiesName2IdMap) {
      println(
        "got",
        data.propertyName,
        app.propertiesMap[app.propertiesName2IdMap[data.propertyName]]
      );
      activated =
        app.propertiesMap[app.propertiesName2IdMap[data.propertyName]];
    }
    numberPropertiesMap[data.propertyName] = new NumberProperty({
      ...data,
      pageId: currentPage.pageId,
      activated,
    });
  });
}

async function repeatWhileNotTrue(fn, intervalMs, timeoutMs) {
  let elapsedMs = 0;
  while (elapsedMs < timeoutMs && !fn()) {
    await sleep(intervalMs);
    elapsedMs += intervalMs;
  }
  return elapsedMs;
}

async function findProperties() {
  await sleep(50);
  await getCurrentPageInfo();
  await repeatWhileNotTrue(
    () =>
      (currentPage.isInPreview
        ? document.querySelector(".notion-peek-renderer .notion-page-content")
        : document.querySelector(".notion-page-content")) != null,
    100,
    10000
  );

  extractProperties();
}
async function mainApp() {
  println("hello world");
  // app = await AppStorage.get("app", defaultAppData)
  // await sleep(200)
  // findProperties();
}

let url = window.location.href;

// ['click', 'popstate', 'onload'].forEach(evt =>
//     window.addEventListener(evt, function () {
//         requestAnimationFrame(() => {
//             if (url !== location.href) {
//                 findProperties();
//             }
//             url = location.href;
//         });
//     }, true)
// );
mainApp();
