// export function getDeviceType() {
//     const sUserAgent = navigator.userAgent.toLowerCase();
//     const bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
//     const bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
//     const bIsMidp = sUserAgent.match(/midp/i) == "midp";
//     const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
//     const bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
//     const bIsAndroid = sUserAgent.match(/android/i) == "android";
//     const bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
//     const bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
//     if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
//       return "phone"
//     } else {
//       return "pc"
//     }
//   }
exports.PACKET_TYPE ={
    PT_UNKNOWN:0,
    PT_SIGN_IN : 1, // 设备登录请求
    PT_SYNC:2, // 消息同步触发
    PT_HEARTBEAT:3, // 心跳
    PT_MESSAGE_ACK:4, // 消息投递
    PT_MESSAGE_SEND:5, //正常聊天消息
    PT_SIGN_IN_RSP:6, //登录响应消息
};
exports.MESSAGE_TYPES ={
	MessageType_MT_UNKNOWN: 0, // 未知
	MessageType_MT_TEXT:1, // 文本
	MessageType_MT_FACE: 2, // 表情
	MessageType_MT_VOICE: 3, // 语音消息
	MessageType_MT_IMAGE: 4, // 图片
	MessageType_MT_FILE: 5, // 文件
	MessageType_MT_LOCATION: 6, // 地理位置
	MessageType_MT_COMMAND: 7, // 指令推送
	MessageType_MT_CUSTOM: 8, // 自定义
};
// export let PACKET_TYPE = PACKET_TYPES;
// export {getDeviceType,PACKET_TYPE};
// export default getDeviceType;