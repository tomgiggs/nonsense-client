
var protoRoot = require('../proto/proto.js');//由 pbjs -t json-module -w commonjs -o scripts/proto.js pkg/proto/*.proto 生成
const Input = protoRoot.lookup('Input');
const Output = protoRoot.lookup('Output');
const SendMessageReq = protoRoot.lookup('SendMessageReq');
const SyncResp = protoRoot.lookup('SyncResp');
const SignInReq = protoRoot.lookup('SignInReq');
const SignInResp = protoRoot.lookup('SignInResp');
import {PACKET_TYPE,MESSAGE_TYPES} from "../utils/util"


function messageReceived( body) {
    console.log('messageReceived: ' + body);
}

// function Client(options){
var Client = function (options) {
    this.MAX_CONNECT_TIMES = 10;
    this.DELAY = 15000;
    this.opts = options || {};
    this.Wsclient;
    this.heartbeatInterval;    
    this.userInfo = this.opts.user|| {
        appId:1,
        deviceId:2,
        userId:2,
        password:"ssss",
    }

    this.wsUrl = options.wsUrl||"ws://127.0.0.1:16001/ws";
    this.createConnect();
}

Client.prototype.heartbeat = function() {

    var msgReq = SignInReq.create({});
    var inputData = Input.create({
        type:PACKET_TYPE.PT_HEARTBEAT,
        requestId:"222",
        data:SignInReq.encode(msgReq).finish()
    })
    var encoded = Input.encode(inputData).finish();
    this.Wsclient.send(encoded);
};

Client.prototype.createConnect = function() {
    let self = this;
    this.Wsclient = new WebSocket(this.wsUrl);
    this.Wsclient.binaryType = 'arraybuffer';
    this.Wsclient.onopen = function () {
        console.log('connection open...')
        // setTimeout(() => {
        //     self.auth();
        // }, 1000);
    };

    self.Wsclient.onmessage = function (evt) {
        var dataView = new Uint8Array(evt.data);
        var decodedMsg = Output.decode(dataView);
        var op = decodedMsg.type;
        var msgBody ;
        switch (op) {
            case PACKET_TYPE.PT_HEARTBEAT:
                console.log('receive: heartbeat');
                self.heartbeat()
                self.heartbeatInterval = setInterval(self.heartbeat, 30 * 1000);
                break;
            case PACKET_TYPE.PT_SYNC:
                msgBody = SyncResp.decode(decodedMsg.data);
                console.log("get sync msg:=======",msgBody);
                self.opts.notify({packageType:op,body:msgBody})
                break;
            case PACKET_TYPE.PT_SIGN_IN_RSP:
                msgBody = SignInResp.decode(decodedMsg.data);
                console.log("get sign resp msg:=======",msgBody);
                self.opts.notify({packageType:op,body:msgBody})
                break
            default:
                console.log("unknow msg")
                break;
        }
    };

    self.Wsclient.onclose = function () {
        console.log("websocket cloing...")
        if (self.heartbeatInterval) clearInterval(self.heartbeatInterval);
        setTimeout(() => {
            self.createConnect();
        }, self.DELAY);
    };
};

Client.prototype.send = function(msg){
    this.Wsclient.send(msg);
};
Client.prototype.sendChatMsg = function(msg){
    console.log("send req is:",msg)
    var msgReq = SendMessageReq.create({
        messageId:"111",
        receiverType:2,
        receiverId:3,
        toUserId:[3],
        sendTime:new Date().getTime(),
        isPersist:true,
        messageBody:msg.body
       
    });
    var inputData = Input.create({
        type:PACKET_TYPE.PT_MESSAGE_SEND,
        requestId:"222",
        data:SendMessageReq.encode(msgReq).finish()
    })
    var encoded = Input.encode(inputData).finish();
    this.Wsclient.send(encoded);
};
Client.prototype.auth = function(userInfo) {
    this.userInfo = userInfo;
    var signInfo = {
        appId:this.userInfo.appId,
        deviceId:this.userInfo.deviceId,
        userId:this.userInfo.userId,
        passwd:this.userInfo.password,
    }
    var msgReq = SignInReq.create(signInfo);
    console.debug("send sign msg: ",msgReq);
    var inputData = Input.create({
        type:PACKET_TYPE.PT_SIGN_IN,
        requestId:"222",
        data:SendMessageReq.encode(msgReq).finish()
    })
    var encoded = Input.encode(inputData).finish();
    this.Wsclient.send(encoded);
}

export default Client;