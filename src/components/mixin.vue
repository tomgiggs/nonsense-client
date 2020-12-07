<script>
import Vue from 'vue'
const mixin = {
  filters: {
    friendlyTime(value) {
      let time = new Date().getTime();
      time = parseInt((time - value) / 1000);
      //存储转换值
      let s;
      if (time < 60 * 3) {
        //三分钟内
        return "刚刚";
      } else if (time < 60 * 60 && time >= 60 * 3) {
        //超过十分钟少于1小时
        s = Math.floor(time / 60);
        return s + "分钟前";
      } else if (time < 60 * 60 * 24 && time >= 60 * 60) {
        //超过1小时少于24小时
        s = Math.floor(time / 60 / 60);
        return s + "小时前";
      } else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
        //超过1天少于3天内
        s = Math.floor(time / 60 / 60 / 24);
        return s + "天前";
      } else {
        //超过3天
        let date = new Date(value);
        return (
          date.getFullYear() +
          "." +
          (date.getMonth() + 1) +
          "." +
          date.getDate()
        );
      }
    },
    formatTime(value) {
      let date = new Date(value);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
      let minutes =
        date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
      let seconds =
        date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
      return (
        year +
        "." +
        month +
        "." +
        day +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
  },
  computed: {
    messages() {
      if (this.curSession.id && this.messageData[this.curSession.id]) {
        return this.messageData[this.curSession.id];
      }
      let MESSAGE={
          from:{
            avatarUrl:"/group-icon.png",
            id:"group_001",
            name:"群聊聊天室01",
            type:"group",
          },
          to:{
            avatarUrl:"/group-icon.png",
            id:"group_002",
            name:"群聊聊天室02",
            type:"group",
          },
          content:'hhhhhhh',
          time:new Date().getTime(),
          type:"group",
          isRead:true
        };
      // return [];
      return [MESSAGE];

},
  },
};

export default mixin;
</script>