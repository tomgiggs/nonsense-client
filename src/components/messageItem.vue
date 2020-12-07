  <!--消息组件模版-->
  <template id="message-item">
  <div
    class="message-item-warp webChat-clear"
    :class="isSend ? 'message-item-send' : 'message-item-receive'"
  >
    <div class="message-avatar">
      <img :src="message.from.avatarUrl" alt="" />
    </div>
    <div class="message-item-container">
      <div class="message-info-container" v-if="setting.isName">
        <span class="message-info-time" v-if="isSend && setting.isTime">{{
          message.time | friendlyTime
        }}</span>
        <span class="message-info-name">{{ message.from.name }}</span>
        <span class="message-info-time" v-if="!isSend && setting.isTime">{{
          message.time | friendlyTime
        }}</span>
      </div>
      <div class="message-content-warp">
        <slot name="message">
          <div class="message-content-container" v-html="message.content"></div>
        </slot>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import Vue from 'vue'
import mixin from "./mixin.vue";
const MessageItem = Vue.extend({
  template: "#message-item",
  name: "MessageItem",
  filters: mixin.filters,
  props: {
    message: {
      type: Object,
      default() {
        var defaultMsg =  {
          from: {
            name: "不知名网友",
          },
          to: {},
          content: "欢迎来到胡说八道聊天室,请不要胡说八道",
          time: new Date().getTime(),
        };
        return defaultMsg;
      },
    },
    isSend: {
      type: Boolean,
      default() {
        return false;
      },
    },
    setting: {
      type: Object,
      default() {
        return {
          isName: true,
          isTime: true,
        };
      },
    },
  },
});
export default MessageItem;

</script>