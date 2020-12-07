  <!--用户组件模版-->
  <template id="user-item">
  <div class="user-item-warp webChat-clear">
    <div class="user-item-avatar">
      <img :src="user.avatarUrl" alt="" />
    </div>
    <div class="user-info-warp">
      <div class="user-item-infoRow">
        <div class="user-item-name">{{ user.name }}</div>
        <span class="user-item-time">
          <slot name="time"></slot>
        </span>
      </div>
      <div class="user-item-infoRow">
        <div class="user-item-message">
          <slot name="message"></slot>
        </div>
        <span class="user-item-num" v-if="num > 0">{{
          num > 99 ? "99+" : num
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
const UserItem = Vue.extend({
  template: "#user-item",
  name: "UserItem",
  props: {
    user: {
      type: Object,
      default() {
        return {
          name: "不知名网友",
          avatarUrl: "http://p4.music.126.net/BUFZLieG5a6E3ZVpkHP6fA==/109951163402069754.jpg",
        };
      },
    },
    num: {
      type: Number,
      default() {
        return 1;
      },
    },
  },
});
export default UserItem;
</script>

