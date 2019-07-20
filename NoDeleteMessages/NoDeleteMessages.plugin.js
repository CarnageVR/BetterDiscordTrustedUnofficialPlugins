//META{"name":"NoDeleteMessages","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence/AutoStartRichPresence.plugin.js"}*//

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

*/

/*
MIT License

Copyright (c) 2018-2019 Mega-Mewthree

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Updated July 20th, 2019.

class NoDeleteMessages {
  getName() {
    return "NoDeleteMessages";
  }
  getShortName() {
    return "NoDeleteMessages";
  }
  getDescription() {
    return 'Prevents the client from removing deleted messages and print edited messages (until restart).\nUse .NoDeleteMessages-deleted-message .markup to edit the CSS of deleted messages (and .NoDeleteMessages-edited-message for edited messages) (Custom CSS ONLY, will not work in themes).\n\nMy Discord server: https://join-nebula.surge.sh\nCreate an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.2.7";
  }
  getAuthor() {
    return "Mega_Mewthree (original), ShiiroSan (edit logging)";
  }
  constructor() {
    this.deletedMessages = {};
    this.editedMessages = {};
    this.CSSID = this.generateRandomString(33);
    this.customCSSID = this.generateRandomString(32);
    this.deletedMessageAttribute = `data-${this.generateRandomString(33)}`;
    this.editedMessageAttribute = `data-${this.generateRandomString(32)}`;
    this.settings = {};
  }
  load() {}
  unload() {}
  start() {
    //TODO: Patch this
    if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing", `The library plugin needed for ${this.getName()} is missing.\n\nPlease download ZeresPluginLibrary here: https://betterdiscord.net/ghdl?id=2252`);
    if (window.ZeresPluginLibrary) this.initialize();
    // DevilBro and NFLD99 are 💩
    const _addClass = window.HTMLElement.prototype.addClass;
    window.HTMLElement.prototype.addClass = function (...args) {
      args = args.filter(a => a !== "NoDeleteMessages-deleted-message" && a !== "NoDeleteMessages-edited-message");
      return _addClass.apply(this, args);
    };
    const _add = window.DOMTokenList.prototype.add;
    window.DOMTokenList.prototype.add = function (...args) {
      args = args.filter(a => a !== "NoDeleteMessages-deleted-message" && a !== "NoDeleteMessages-edited-message");
      return _add.apply(this, args);
    };
    const _removeAttribute = window.HTMLElement.prototype.removeAttribute;
    window.HTMLElement.prototype.removeAttribute = function (...args) {
      args = args.filter(a => !(/^data-[A-z0-9]{20,}$/.test(a)));
      if (args.length === 0) return;
      return _removeAttribute.apply(this, args);
    };
    const _removeAttribute2 = window.Element.prototype.removeAttribute;
    window.Element.prototype.removeAttribute = function (...args) {
      args = args.filter(a => !(/^data-[A-z0-9]{20,}$/.test(a)));
      if (args.length === 0) return;
      return _removeAttribute2.apply(this, args);
    };
    const _removeAttributeNode = window.HTMLElement.prototype.removeAttributeNode;
    window.HTMLElement.prototype.removeAttributeNode = function (...args) {
      args = args.filter(a => !(/^data-[A-z0-9]{20,}$/.test(a)));
      if (args.length === 0) return;
      return _removeAttributeNode.apply(this, args);
    };
    const _removeAttributeNode2 = window.Element.prototype.removeAttributeNode;
    window.Element.prototype.removeAttributeNode = function (...args) {
      args = args.filter(a => !(/^data-[A-z0-9]{20,}$/.test(a)));
      if (args.length === 0) return;
      return _removeAttributeNode2.apply(this, args);
    };
    const _atob = window.atob;
    window.atob = function (...args) {
      if (
        args[0] === "Tm9EZWxldGVNZXNzYWdlcy1kZWxldGVkLW1lc3NhZ2U=" ||
        args[0] === "Tm9EZWxldGVNZXNzYWdlcy1lZGl0ZWQtbWVzc2FnZQ==" ||
        args[0] === "NDM4NDY5Mzc4NDE4NDA5NDgz" ||
        args[0] === "MzIwMDgyNTc4NDU3NjI0NTg5" ||
        args[0] === "MjIwNTg0NzE1MjY1MTE0MTEz"
      ) {
        return this.generateRandomString(20);
      }
      return _atob.apply(this, args);
    };
  }
  initialize() {
    this.settings = BdApi.loadData("NoDeleteMessages", "settings") || {
      customCSS: ""
    };
    ZeresPluginLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordTrustedUnofficialPlugins/master/${this.getName()}/${this.getName()}.plugin.js`);
    this.replaceCustomCSS();

    const that = this;
    this.oldCoreInitSettings = Core.prototype.initSettings;
    Core.prototype.initSettings = function (...args) {
      that.oldCoreInitSettings.apply(this, args);
      that.replaceCustomCSS();
    };
    this.oldDetachedEditorUpdate = V2C_CssEditorDetached.prototype.updateCss;
    V2C_CssEditorDetached.prototype.updateCss = function (...args) {
      that.oldDetachedEditorUpdate.apply(this, args);
      that.replaceCustomCSS();
    };
    this.oldEditorUpdate = V2C_CssEditor.prototype.updateCss;
    V2C_CssEditor.prototype.updateCss = function (...args) {
      that.oldEditorUpdate.apply(this, args);
      that.replaceCustomCSS();
    };

    BdApi.injectCSS(this.CSSID, `
      [${this.deletedMessageAttribute}] .da-markup {
        color: #F00 !important;
      }
      [${this.deletedMessageAttribute}]:not(:hover) img, [${this.deletedMessageAttribute}]:not(:hover) .mention, [${this.deletedMessageAttribute}]:not(:hover) .reactions, [${this.deletedMessageAttribute}]:not(:hover) a {
        filter: grayscale(100%) !important;
      }
      [${this.deletedMessageAttribute}] img, [${this.deletedMessageAttribute}] .mention, [${this.deletedMessageAttribute}] .reactions, [${this.deletedMessageAttribute}] a {
        transition: filter 0.3s !important;
        transform-origin: top left;
        transform: translateZ(0) scale(1.1);
      }
      [${this.editedMessageAttribute}] > [${this.editedMessageAttribute}]:not(:last-child) > [${this.editedMessageAttribute}], :not([${this.editedMessageAttribute}]) > [${this.editedMessageAttribute}] {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      [${this.deletedMessageAttribute}] :not([${this.editedMessageAttribute}]) > [${this.editedMessageAttribute}], [${this.deletedMessageAttribute}] [${this.editedMessageAttribute}] > [${this.editedMessageAttribute}]:not(:last-child) > [${this.editedMessageAttribute}] {
        color: rgba(240, 71, 71, 0.5) !important;
      }
      [${this.deletedMessageAttribute}] [${this.editedMessageAttribute}] > [${this.editedMessageAttribute}]:last-child > [${this.editedMessageAttribute}] {
        color: #F00 !important;
      }
    `);

    BdApi.injectCSS(this.customCSSID, this.settings.customCSS.replace(/<DELETED_MESSAGE>/g, `[${this.deletedMessageAttribute}]`));

    ZeresPluginLibrary.Patcher.instead(this.getName(), ZeresPluginLibrary.WebpackModules.find(m => m.dispatch), "dispatch", (thisObject, args, originalFunction) => {
      let shouldFilter = this.filter(args[0]);
      if (!shouldFilter) return originalFunction(...args);
    });
    ZeresPluginLibrary.Patcher.instead(this.getName(), ZeresPluginLibrary.WebpackModules.find(m => m.startEditMessage), "startEditMessage", (thisObject, args, originalFunction) => {
      if (!this.editedMessages[args[0]] || !this.editedMessages[args[0]][args[1]]) return originalFunction(...args);
      const edits = this.editedMessages[args[0]][args[1]];
      args[2] = edits[edits.length - 1].message;
      return originalFunction(...args);
    });
    console.log("NoDeleteMessages has started!");
    ZeresPluginLibrary.Toasts.success("NoDeleteMessages has started!");
    this.initialized = true;
  }
  stop() {
    this.deletedMessages = {};
    this.editedMessages = {};
    Core.prototype.initSettings = this.oldCoreInitSettings;
    V2C_CssEditorDetached.prototype.updateCss = this.oldDetachedEditorUpdate;
    V2C_CssEditor.prototype.updateCss = this.oldEditorUpdate;
    this.resetCustomCSS();
    BdApi.clearCSS(this.CSSID);
    BdApi.clearCSS(this.customCSSID);
    ZeresPluginLibrary.Patcher.unpatchAll(this.getName());
  }
  generateRandomString(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  replaceCustomCSS() {
    const customCSS = document.getElementById("customcss");
    if (customCSS) {
      customCSS.innerHTML = customCSS.innerHTML.replace(/\.NoDeleteMessages\-deleted\-message/g, `[${this.deletedMessageAttribute}]`).replace(/\.NoDeleteMessages\-edited\-message/g, `[${this.editedMessageAttribute}]`);
    }
  }
  resetCustomCSS() {
    const customCSS = document.getElementById("customcss");
    if (customCSS) {
      customCSS.innerHTML = customCSS.innerHTML.split(`[${this.deletedMessageAttribute}]`).join(".NoDeleteMessages-deleted-message").split(`[${this.editedMessageAttribute}]`).join(".NoDeleteMessages-edited-message");
    }
  }
  filter(evt) {
    if (evt.type === "MESSAGE_DELETE") {
      if (Array.isArray(this.deletedMessages[evt.channelId])) {
        if (this.deletedMessages[evt.channelId].length > 149) this.deletedMessages[evt.channelId].shift(); // 150 because only 150 messages are stored per channel.
        this.deletedMessages[evt.channelId].push(evt.id);
      } else {
        this.deletedMessages[evt.channelId] = [evt.id];
      }
      if (evt.channelId === this.getCurrentChannelID()) this.updateDeletedMessages();
      return true;
    } else if (evt.type === "MESSAGE_DELETE_BULK") {
      if (Array.isArray(this.deletedMessages[evt.channelId])) {
        if (this.deletedMessages[evt.channelId].length + evt.ids.length > 149) this.deletedMessages[evt.channelId].splice(0, this.deletedMessages[evt.channelId].length + evt.ids.length - 150);
        this.deletedMessages[evt.channelId].push(...evt.ids);
      } else {
        this.deletedMessages[evt.channelId] = [...evt.ids];
      }
      if (evt.channelId === this.getCurrentChannelID()) this.updateDeletedMessages();
      return true;
    } else if (evt.type === "MESSAGE_UPDATE" && evt.message.edited_timestamp) {
      /*
       * editedMessage works like this
       * [channel_id][message_id]
       *   message: text
       */
      if (Array.isArray(this.editedMessages[evt.message.channel_id])) {
        if (this.editedMessages[evt.message.channel_id].length > 149) this.editedMessages[evt.message.id].shift();
      }
      if (!this.editedMessages[evt.message.channel_id]) {
        this.editedMessages[evt.message.channel_id] = [evt.message.id];
        this.editedMessages[evt.message.channel_id][evt.message.id] = [{
          message: evt.message.content,
          dateTime: new Date().toISOString()
        }];
      } else if (!this.editedMessages[evt.message.channel_id][evt.message.id]) {
        this.editedMessages[evt.message.channel_id][evt.message.id] = [{
          message: evt.message.content,
          dateTime: new Date().toISOString()
        }];
      } else {
        if (this.editedMessages[evt.message.channel_id][evt.message.id].length > 49) {
          this.editedMessages[evt.message.channel_id][evt.message.id].shift() //I think 50 edits is enough no?
        }
        this.editedMessages[evt.message.channel_id][evt.message.id].push({
          message: evt.message.content,
          dateTime: new Date().toISOString()
        });
      }
      if (evt.message.channel_id === this.getCurrentChannelID()) this.updateEditedMessages();
      return true;
    }
    return false;
  }
  observer({
    addedNodes
  }) {
    let len = addedNodes.length;
    let change;
    while (len--) {
      change = addedNodes[len];
      if (change.classList && (change.classList.contains("da-messagesWrapper") || change.classList.contains("da-chat")) || change.firstChild && change.firstChild.classList && change.firstChild.classList.contains("da-message")) {
        this.updateDeletedMessages();
        this.updateEditedMessages();
        break;
      }
    }
  }
  updateDeletedMessages() {
    const channelDeletedMessages = this.deletedMessages[this.getCurrentChannelID()];
    if (!channelDeletedMessages) return;
    $(".da-message").each((index, elem) => {
      try {
        const messageID = ZeresPluginLibrary.ReactTools.getOwnerInstance(elem).props.message.id;
        if (channelDeletedMessages.includes(messageID)) {
          elem.setAttribute(this.deletedMessageAttribute, "");
        }
      } catch (e) {}
    });
  }

  updateEditedMessages() {
    const channelEditedMessages = this.editedMessages[this.getCurrentChannelID()];
    if (!channelEditedMessages) return;
    $(".da-markup").each((index, elem) => {
      try {
        const markupClassName = this.findModule("markup")["markup"].split(" ")[0];
        while (elem.getElementsByClassName(markupClassName).length)
          elem.getElementsByClassName(markupClassName)[0].remove();
        const messageID = ZeresPluginLibrary.ReactTools.getOwnerInstance(elem).props.message.id;
        if (channelEditedMessages[messageID]) {
          elem.setAttribute(this.editedMessageAttribute, "");
          const edited = this.editedMessages[this.getCurrentChannelID()][messageID];
          const editedClassName = this.findModule("edited")["edited"].split(" ")[0];
          for (let i = 0; i < edited.length; i++) {
            const elementEdited = this.showEdited(edited[i].message);

            var timeElement = elementEdited.children[0].children[0];
            var actualDate = new Date();
            var messageEditDate = new Date(edited[i].dateTime);
            var timeEdit = "";
            if (actualDate.toLocaleDateString() == messageEditDate.toLocaleDateString()) {
              timeEdit += "Today at"
            } else {
              timeEdit += messageEditDate.toLocaleDateString();
            }
            timeEdit += " " + messageEditDate.toLocaleTimeString();
            new ZeresPluginLibrary.EmulatedTooltip(timeElement, timeEdit);

            elementEdited.setAttribute(this.editedMessageAttribute, "");
            elem.appendChild(elementEdited);
          }
        }
      } catch (e) {}
    });
  }

  showEdited(content) {
    const editText = document.createElement("div");

    const renderFunc = this.findModule("render");
    const createElementFunc = this.findModule("createElement");
    const parserForFunc = this.findModule(["parserFor", "parse"]);
    const editedClassName = this.findModule("edited")["edited"].split(" ")[0];

    renderFunc.render(
      createElementFunc.createElement("div", {
          className: this.findModule("markup")["markup"].split(" ")[0],
          [this.editedMessageAttribute]: true
        },
        parserForFunc.parse(content),
        //TODO: Find a way to implement display time of edit
        createElementFunc.createElement("time", {
            className: editedClassName + " da-edited",
            role: "note"
          },
          parserForFunc.parse("(edited)")
        )
      ),
      editText
    );

    return editText;
  }

  findModule(properties) {
    if (typeof properties === "string") { //search for an unique property
      return ZeresPluginLibrary.WebpackModules.find(module => module[properties] != undefined);
    } else { //search multiple properties
      return ZeresPluginLibrary.WebpackModules.find(module => properties.every(property => module[property] != undefined));
    }
  }

  getCurrentChannelID() {
    return ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId();
  }

  updateCustomCSS(css) {
    this.settings.customCSS = css;
    BdApi.clearCSS(this.customCSSID);
    BdApi.injectCSS(this.customCSSID, this.settings.customCSS.replace(/<DELETED_MESSAGE>/g, `[${this.deletedMessageAttribute}]`));
  }

  updateSettings() {
    BdApi.saveData("NoDeleteMessages", "settings", this.settings);
  }

  getSettingsPanel() {
    if (!this.initialized) return;
    this.settings = BdApi.loadData("NoDeleteMessages", "settings") || {
      customCSS: ""
    };
    const panel = $("<form>").addClass("form").css("width", "100%");
    if (this.initialized) this.generateSettings(panel);
    return panel[0];
  }

  generateSettings(panel) {
    new window.ZeresPluginLibrary.Settings.SettingGroup("Configuration", {
      collapsible: false,
      shown: true,
      callback: () => {
        this.updateSettings();
      }
    }).appendTo(panel).append(
      new window.ZeresPluginLibrary.Settings.Textbox("Custom CSS (DEPRECATED, DO NOT USE)", "Custom CSS that is compatible with this plugin. (DEPRECATED, DO NOT USE)", (this.settings && this.settings.customCSS) || "", val => {
        this.updateCustomCSS(val);
      })
    );
  }
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCgAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAl0zpgsACgkQf4qgY6Fc
SQtjigf8Dw8VmsqL847NX4XdaE7MH5n4QWjSm0xln7jGuH5XGKmZlKuxxcr/X+1g
tcIpDuqV/HiHc3X/4JGoBWSvjeqSdFOkU2lL1TZMP2aUGACcbwQMkl+XXl2tIVvW
XV09uKl8xoAmuCecMA5ZKXI+u0iahZmtTPtSX+QZJxd7tnYuvBxeEXc3dcpiqU6N
fYBMec+RTXoEKDfEuEz2uei/jjljOvIoRRTPrtfgh87F/PVmXRsbJCPcD4yGY0YW
XtL1sEYSnRgK/Dr3s9Y1+h7/58ZsGZM7ZxHkkjGG2gvujT+vQdjOqdnj8SPULZ9a
r0kn3IvOaZ9eptEPW7limoExvZYhpA==
=Qvo/
-----END PGP SIGNATURE-----
*/
