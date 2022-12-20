// src/client.ts
if (!fetch)
  throw new Error("fetch is not available");
var Client = class {
  constructor(username, password, cookie) {
    if (!username)
      throw new Error("username is required");
    if (!password && !cookie)
      throw new Error("password or cookie is required");
    this._username = username;
    this._cookie = null;
    if (cookie)
      this._cookie = cookie;
    else
      this._password = password;
    this._client = this;
    this._bsid = null;
    this.unlocks = {};
  }
  async POST(url, data) {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
        "Cookie": this._cookie || ""
      },
      body: JSON.stringify(data),
      credentials: "include"
    });
  }
  async GET(url) {
    return await fetch(url, {
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Cookie": this._cookie || ""
      },
      "referrerPolicy": "no-referrer",
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
  }
  async PUT(url, data) {
    return await fetch(url, {
      method: "PUT",
      headers: {
        "accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        "cookie": this._cookie || ""
      },
      body: JSON.stringify(data),
      credentials: "include"
    });
  }
  async DELETE(url) {
    return await fetch(url, {
      method: "DELETE",
      headers: {
        "accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        "cookie": this._cookie || ""
      },
      credentials: "include"
    });
  }
  async PATCH(url, data) {
    return await fetch(url, {
      method: "PATCH",
      headers: {
        "accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/json",
        "cookie": this._cookie || ""
      },
      body: JSON.stringify(data),
      credentials: "include"
    });
  }
  async handleLogin(bsid) {
    if (bsid) {
      this._bsid = bsid;
      this._cookie = `bsid=${bsid}`;
      return await this.GET("https://dashboard.blooket.com/api/users");
    } else {
      return await this.POST("https://id.blooket.com/api/users/login", {
        name: this._username,
        password: this._password
      });
    }
  }
  async login(bsid) {
    if (!(this._password || this._username) && !bsid)
      throw new Error("username & password OR bsid is required");
    const res = await this.handleLogin(bsid);
    if (res.status !== 200)
      throw new Error("something went wrong. is your password or username invalid? what about bsid?");
    if (res.url.includes("login")) {
      this._cookie = res.headers.get("set-cookie");
      this._bsid = this._cookie.split("bsid=")[1].split(";")[0];
    }
    return this._client;
  }
  async handleBlooks(user) {
    if (user) {
      const res = await this.GET(`https://dashboard.blooket.com/api/users?name=${user}`);
      return res;
    } else {
      const res = await this.GET("https://dashboard.blooket.com/api/users/blooks");
      return res;
    }
  }
  async getBlooks(user) {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.handleBlooks(user);
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    if (res.url.includes("?name"))
      return (await res.json()).unlocks;
    const j = await res.json();
    this.unlocks = j;
    return j;
  }
  async getStats(user) {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.GET(`https://dashboard.blooket.com/api/users?name=${user || this._username}`);
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getConfig() {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.GET("https://dashboard.blooket.com/api/config");
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getMe() {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.GET("https://dashboard.blooket.com/api/users/me");
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async addRewards(tokens, xp) {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.PUT("https://play.blooket.com/api/users/add-rewards", {
      tokens,
      xp
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async openPack(packName) {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.PUT("https://dashboard.blooket.com/api/users/unlockblook", {
      name: this._username,
      box: packName
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist or this pack does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async openPacks(packs) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!packs)
      throw new Error("packs is required");
    const results = { newBlooks: [], blooks: {} };
    packs.forEach(async (pack) => {
      for (let i = 0; i < pack.amount; i++) {
        const r = await this.openPack(pack.name);
        if (r.isNewBlook)
          results.newBlooks.push(r.unlockedBlook);
        else {
          if (!results.blooks[r.unlockedBlook])
            results.blooks[r.unlockedBlook] = 0;
          results.blooks[r.unlockedBlook] += 1;
        }
      }
    });
    return results;
  }
  async sellBlook(blook, amount) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!blook)
      throw new Error("blook is required");
    const res = await this.PUT("https://dashboard.blooket.com/api/users/sellblook", {
      name: this._username,
      blook,
      numSold: amount
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async sellBlooks(blooks) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!blooks)
      throw new Error("blooks is required");
    const resps = [];
    blooks.forEach(async (blook) => {
      resps.push(await this.sellBlook(blook.blook, blook.amount));
    });
    if (resps.every((r) => r.success))
      return true;
    else
      return false;
  }
  async setBlook(blook) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!blook)
      throw new Error("blook is required");
    const res = await this.PUT("https://dashboard.blooket.com/api/users/change/blook", {
      blook
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async setBanner(banner) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!banner)
      throw new Error("banner is required");
    const res = await this.PUT("https://dashboard.blooket.com/api/users/change/banner", {
      banner
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async setTitle(title) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!title)
      throw new Error("title is required");
    const res = await this.PUT("https://dashboard.blooket.com/api/users/change/title", {
      title
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getSets() {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.GET("https://dashboard.blooket.com/api/users/allsets");
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getSet(id) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!id)
      throw new Error("id is required");
    const res = await this.GET("https://dashboard.blooket.com/api/games?gameId=" + id);
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getFavoriteGames() {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.GET("https://dashboard.blooket.com/api/users/favoriteGames");
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getHistories(userid) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!userid)
      throw new Error("userid is required");
    const res = await this.GET("https://dashboard.blooket.com/api/users/histories?id=" + userid);
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async updateFavorites(gameid, isFavoriting = true) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!gameid)
      throw new Error("gameid is required");
    const res = await this.PUT("https://dashboard.blooket.com/api/users/updatefavorites", {
      gameId: gameid,
      isUnfavoriting: !isFavoriting
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getNews() {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.GET("https://dashboard.blooket.com/api/news");
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getMarket() {
    if (!this._cookie)
      throw new Error("cookie is required");
    const res = await this.GET("https://dashboard.blooket.com/api/users/market");
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return await res.json();
  }
  async getTokens() {
    const market = await this.getMarket();
    return market.tokens;
  }
  async getBanners() {
    const market = await this.getMarket();
    return market.banners;
  }
  async getTitles() {
    const market = await this.getMarket();
    return market.titles;
  }
  async getBlookParts() {
    const market = await this.getMarket();
    return market.blookParts;
  }
  async createCustomBlook(blookIndex = 0, customBlook) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!blookIndex)
      throw new Error("blookIndex is required");
    if (!customBlook)
      throw new Error("customBlook is required");
    const res = await this.PUT("https://dashboard.blooket.com/api/users/custom-blooks", {
      blookIndex,
      customBlook
    });
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return this._client;
  }
  async postHistory(history) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!history)
      throw new Error("history is required");
    const res = await this.POST("https://play.blooket.com/api/history", history);
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this user/history does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return this._client;
  }
  async deleteHistory(historyId) {
    if (!this._cookie)
      throw new Error("cookie is required");
    if (!historyId)
      throw new Error("historyId is required");
    const res = await this.DELETE("https://dashboard.blooket.com/api/history?id=" + historyId);
    if (res.status === 401)
      throw new Error("authentication failed. make sure your cookie is valid and you are logged in.");
    if (res.status === 403)
      throw new Error("you do not have permission to access this resource");
    if (res.status === 404)
      throw new Error("this history does not exist");
    if (res.status !== 200)
      throw new Error("unknown error (" + res.status + " " + res.statusText + ")");
    return this._client;
  }
  getCookie() {
    return this._cookie;
  }
  getBsid() {
    return this._bsid;
  }
  makeBsid() {
    if (!this._cookie)
      throw new Error("cookie is required");
    this._bsid = this._cookie.split("bsid=")[1].split(";")[0];
    return this._client;
  }
  setCookie(cookie) {
    this._cookie = cookie;
    return this._client;
  }
  setBsid(bsid) {
    this._bsid = bsid;
    return this._client;
  }
};

// src/params.ts
var params_exports = {};
export {
  Client,
  params_exports as Params
};
//# sourceMappingURL=index.js.map