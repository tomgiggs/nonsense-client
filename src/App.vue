<template>
  <div id="app">
    <div class="webChat-warp">
      <div class="webChat-container webChat-clear" v-if="isLogin">
        <div class="webChat-menu-warp">
          <div class="webChat-login-avatar">
            <img :src="loginUser.avatarUrl" alt="">
          </div>
          <ul class="webChat-menu-list">
            <li :class="{active:curMenu==='chat'}"><span class="iconfont icon-comments" @click="curMenu='chat'"></span></li>
            <li :class="{active:curMenu==='cog'}"><span class="iconfont icon-cog" @click="curMenu='cog'"></span></li>
            <li :class="{active:curMenu==='cog'}"><span class="iconfont icon-info" @click="curMenu='about'"></span></li>
          </ul>
        </div>
        <div class="webChat-panel">
          <div class="webChat-clear webChat-panel-item" v-show="curMenu=='chat'">
            <div class="webChat-users-warp">
              <div class="webChat-search-container">
                <span class="iconfont icon-search"></span>
                <input type="text" placeholder="搜索" v-model="keyword" class="webChat-search-input">
              </div>
              <div class="webChat-users-container">
                <div class="webChat-user-list scroll">
                  <user-item :user="item"
                             @click.native="changeSession(item)"
                             :class="{active:item.id===curSession.id}"
                             v-for="item in searchUser(keyword)"
                             :num="getUnReadNum(item.id)"
                             :key="item.id">
                    <div slot="time" v-if="getLatestMessage(item.id).time">{{getLatestMessage(item.id).time | friendlyTime}}</div>
                    <span slot="message" v-if="getLatestMessage(item.id).type==='text'">
                      <message-text :text="getLatestMessage(item.id).content"></message-text>
                    </span>
                    <div slot="message" v-if="getLatestMessage(item.id).type==='image'">[图片]</div>
                  </user-item>
                </div>
              </div>
            </div>
            <div class="webChat-session-panel" v-if="curSession.id">
              <div class="webChat-session-header">
                <img :src="curSession.avatarUrl" alt="" class="webChat-session-avatar">
                <span class="webChat-session-name">{{curSession.name}}</span>
                <span class="webChat-session-text" v-if="curSession.type==='group'">({{onlineUsers.length}})</span>
                <span class="iconfont user-device" v-if="curSession.deviceType" :class="{'icon-phone':curSession.deviceType==='phone','icon-pc':curSession.deviceType==='pc'}"></span>
                <span class="webChat-session-text" v-if="curSession.ip">({{curSession.ip}})</span>
              </div>
              <div class="webChat-session-messages">
                <div class="webChat-message-list scroll" ref="message-list">
                  <message-item v-for="(item,i) in messages" :is-send="loginUser.id===item.from.id" :setting="setting" :key="i" :message="item">
                    <div class="message-content-container" slot="message" v-if="item.type==='text'">
                      <message-text :text="item.content"></message-text>
                    </div>
                    <div class="message-image-warp" slot="message" v-if="item.type==='image'" v-html="item.content"></div>
                  </message-item>
                </div>
              </div>
              <div class="webChat-session-tool">
                <span class="iconfont icon-expression" @click.stop="toggleExpression"></span>
                <label class="iconfont icon-img">
                  <input type="file" class="webChat-img-file" accept="image/png, image/jpeg" @change="fileChange">
                </label>
                <transition name="slide">
                  <div class="expression-panel-warp" v-show="isShowExpression">
                    <div class="expression-panel-container">
                      <div class="expression-item"
                           v-for="item in expressions"
                           :title="item.title"
                           @click.stop="pickerExpression(item)"
                           :key="item.title">
                        <img :src="emotionsUrl+item.url" alt="">
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <div class="webChat-session-footer">
                <div class="webChat-textarea-warp">
                  <textarea class="webChat-textarea scroll" placeholder="请输入信息" v-model="text" @keypress.enter="sendText(text)"></textarea>
                </div>
                <div class="webChat-sendBtn-warp">
                  <button class="webChat-session-sendBtn" @click="sendText(text)">发送</button>
                </div>
              </div>
            </div>
            <div class="webChat-session-panel" v-else>
              <span class="iconfont icon-wechat"></span>
            </div>
          </div>
          <div class="webChat-clear webChat-panel-item" v-show="curMenu=='cog'">
            <div class="webChat-setting-warp">
              <div class="webChat-setting-header">设置</div>
              <div class="webChat-setting-card webChat-clear">
                <div class="webChat-card-avatar">
                  <img :src="loginUser.avatarUrl" alt="">
                </div>
                <div class="webChat-card-info">
                  <div class="webChat-card-infoRow webChat-card-name">{{loginUser.name}}</div>
                  <div class="webChat-card-infoRow webChat-card-text">
                    <span class="iconfont" :class="{'icon-phone':loginUser.deviceType==='phone','icon-pc':loginUser.deviceType==='pc'}"></span>
                    {{loginUser.ip}}
                  </div>
                  <div class="webChat-card-infoRow webChat-card-text">{{loginUser.time | formatTime}}</div>
                </div>
              </div>
              <ul class="webChat-setting-list">
                <li><input type="checkbox" v-model="setting.isVoice"><span>消息声音</span></li>
                <li><input type="checkbox" v-model="setting.isName"><span>显示昵称</span></li>
                <li><input type="checkbox" v-model="setting.isTime"><span>消息时间</span></li>
              </ul>
            </div>
          </div>
          <div class="webChat-clear webChat-panel-item" v-show="curMenu=='about'">
            <div class="webChat-about-warp">
              <div class="webChat-about-header">关于</div>
              <ul class="webChat-about-list">
                <li>
                  <span class="about-label">版本：</span>
                  <span class="about-text">{{about.version}}</span>
                </li>
                <li>
                  <span class="about-label">协议：</span>
                  <span class="about-text">{{about.license}}</span>
                </li>
                <li>
                  <span class="about-label">作者：</span>
                  <span class="about-text">{{about.author}}</span>
                </li>
                <li>
                  <span class="about-label">邮箱：</span>
                  <span class="about-text">{{about.email}}</span>
                </li>
                <li>
                  <span class="about-label">仓库：</span>
                  <a class="about-link" :href="about.github" target="_blank">{{about.github}}</a>
                </li>
              </ul>
            </div>
          </div>
          <!-- <span class="is-connect iconfont icon-09" v-if="socket&&!isConnect" title="断线重连"></span> -->
        </div>
      </div>
      <login @loginResult='isLoginFromSun' ref="login" v-else></login>
      <audio :src="audioUrl" ref="audio"></audio>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Login from "./components/login.vue";//要怎么设置首屏展示那个组件呢？
import MessageItem from "./components/messageItem.vue";
import userItem from "./components/userItem.vue";
import messageText from "./components/messageText.vue";
import mixin from "./components/mixin.vue";
import expressions from "./utils/emotions";
import mapData from "./utils/emotions";
import WSClient from "./utils/wsclient";
var protoRoot = require('./proto/proto.js');//由 pbjs -t json-module -w commonjs -o scripts/proto.js pkg/proto/*.proto 生成
const MessageBody = protoRoot.lookup('MessageBody');
import {MESSAGE_TYPES} from "./utils/util"
console.log(MESSAGE_TYPES)
export default {
  name: 'App',
  el: "#app",
  components: { MessageItem, userItem,messageText,Login},
  mixins: [mixin],
  data() {
    return {
      isLogin:false,
      expressions,
      isShowExpression: false,
      isConnect: false,
      isShowTool: false,
      isFocus: false,
      wsClient: null,
      showAlter:false,
      alterType:"error",
      altrtMsg:"",
      loginUser: {
            avatarUrl:"/group-icon.png",
            id:"group_001",
            name:"群聊聊天室",
            type:"group",
            deviceType:'phone',
            ip:"127.0.0.1",
            time:1607269821289
          },
      messageData: {},
      curSession: {
            avatarUrl:"/group-icon.png",
            id:"group_001",
            userId:2,
            name:"群聊聊天室",
            type:"group",
          },
      onlineUsers: [{
            avatarUrl:"/group-icon.png",
            id:"group_001",
            name:"群聊聊天室001",
            type:"group",
          },{
            avatarUrl:"/group-icon.png",
            id:"group_002",
            name:"群聊聊天室002",
            type:"group",
          },{
            avatarUrl:"/group-icon.png",
            id:"group_003",
            name:"群聊聊天室003",
            type:"group",
          }],
      text: "",
      keyword: "",
      curMenu: "chat",
      setting: {
        isTime: true,
        isName: true,
        isVoice: true,
      },
      about: {
        version: "v1.0",
        license: "MIT",
        author: "cleverqin",
        email: "705597001@qq.com",
        github: "https://github.com/cleverqin/node-websocket-Chatroom",
      },
      emotionsUrl: "/qq",
      socketURL: "",
      audioUrl: "./assets/images/8400.mp3", 
    };
  },

  created() {
    console.log("chatroom init...");
    this.wsClient = new WSClient({
      notify: this.wsCallback,
      wsUrl: "ws://127.0.0.1:16001/ws",
      user:{
        appId:1,
        deviceId:2,
        userId:2,
        password:"ssss",
      }
    });

  },
  mounted() {
    document.addEventListener("click", () => {
      this.isShowExpression = false;
      this.isShowTool = false;
    });
  },
  methods: {
    hideExpression() {
      this.isShowExpression = false;
    },
    toggleExpression() {
      this.isShowExpression = !this.isShowExpression;
      this.isShowTool = false;
    },
    pickerExpression(item) {
      this.text += item.title;
    },
    fileChange(e) {
      let file = e.target.files[0];
      let maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        this.alterMsg("图片大小不能超过1M!");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onloadend = () => {
        this.sendMessage("<img src='" + reader.result + "'>", "image");
        e.target = null;
      };
    },
    login(user) {
      if (this.wsClient) {
        this.wsClient.sendMessage();
      }
      console.log("logining....")
    },
    isLoginFromSun(msg){
      // console.log('get msg from login.vue',msg)
      this.wsClient.auth({
        appId:1,
        deviceId:2,
        userId:2,
        password:""
      })
      this.isLogin = true;
    },
    wsCallback(msgbody) {
      if (msgbody == null){
        return
      }
      console.log("get ws msg :", msgbody.packageType,msgbody.body);
      let MESSAGE = {
        from: {
          avatarUrl: "/group-icon.png",
          id: "group_001",
          name: "群聊聊天室",
          type: "group",
        },
        to: {
          avatarUrl: "/group-icon.png",
          id: "group_001",
          name: "群聊聊天室",
          type: "group",
        },
        content: msgbody,
        time: new Date().getTime(),
        type: "group",
        isRead: true,
      };
      this.addMessage(MESSAGE, MESSAGE.to.id);
    },
    toggleTool() {
      this.isShowTool = !this.isShowTool;
      this.isShowExpression = false;
    },
    addMessage(message, sessionId) {
      if (!this.messageData[sessionId]) {
        this.$set(this.messageData, sessionId, []);
      }
      this.messageData[sessionId].push(message);
      if (this.curSession.id === sessionId) {
        this.scrollFooter("message-list");
      }
      if (
        message.from.id !== this.loginUser.id &&
        this.curSession.id !== sessionId
      ) {
        if (this.$refs["audio"] && this.setting.isVoice) {
          this.$refs["audio"].play();
        }
      }
    },
    getMessages(sessionId) {
      if (this.messageData[sessionId]) {
        return this.messageData[sessionId];
      }
      return [];
    },
    getLatestMessage(sessionId) {
      const messages = this.messageData[sessionId];
      if (messages && messages.length > 0) {
        return messages[messages.length - 1];
      }
      return {};
    },
    getUnReadNum(sessionId) {
      let num = 0;
      const messages = this.messageData[sessionId];
      if (messages && messages.length > 0) {
        messages.forEach((item) => {
          if (!item.isRead) {
            num++;
          }
        });
      }
      return num;
    },
    setSessionRead(sessionId) {
      let messages = this.messageData[sessionId];
      if (messages && messages.length > 0) {
        messages.forEach((item) => {
          item.isRead = true;
        });
      }
    },
    changeSession(session) {
      if (session.id === this.curSession.id) {
        return;
      }
      this.curSession = session;
      this.setSessionRead(session.id);
      this.$nextTick(() => {
        this.scrollFooter("message-list");
      });
    },
    searchUser(keyword) {
      let users = [];
      this.onlineUsers.forEach((item) => {
        if (
          item.name.indexOf(keyword) !== -1 ||
          item.id.indexOf(keyword) !== -1
        ) {
          users.push(item);
        }
      });
      return users;
    },
    sendText(text) {
      text = text.replace(/^\s+|\s+$/g, "");
      if (text) {
        this.sendMessage(this.text, "text");
        this.text = "";
      } else {
        this.text = "";
      }
    },
    addUser(user) {
      this.onlineUsers.push(user);
    },
    removeUser(user) {
      this.onlineUsers.forEach((item, i) => {
        if (item.id === user.id) {
          this.onlineUsers.splice(i, 1);
        }
      });
    },
    sendMessage(html, type) {
      let message = {
        from: this.loginUser,
        to: this.curSession,
        content: html,
        time: new Date().getTime(),
        type: type,
        isRead: true,
      };
      let wsMsg = {
        from: this.loginUser,
        to: this.curSession,
        body:{
            messageType:MESSAGE_TYPES.MessageType_MT_TEXT,
            messageContent:{
                text:{
                    text:html
                }
            }
        }
      }
      
      this.wsClient.sendChatMsg(wsMsg)
      this.addMessage(message, message.to.id);

    },
    alterMsg(msg){
      window.alter(msg)
    },
    delELe:function () {
      this.$el.remove()
    },
    scrollFooter(name) {
      let $el = this.$refs[name];
      if ($el) {
        this.$nextTick(() => {
          $el.scrollTop = $el.scrollHeight;
        });
      }
    },
    
  },
};
</script>


<style>
	@import './style/lib.css';
	@import './style/common.css';

</style>