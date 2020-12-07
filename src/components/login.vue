  <template id="login">
  <div class="user-login-warp">
    <div class="user-login-container">
      <div class="user-login-banner"></div>
      <div class="user-login-form-warp">
        <div class="user-login-form">
          <div class="user-login-avatar">
            <img
              :src="user.avatarUrl"
              alt=""
              class="login-avatar"
              @click.stop="toggleAvatarSelect"
            />
          </div>
          <div class="form-input-warp">
            <div class="form-group">
              <input
                type="text"
                class="form-input input-text"
                placeholder="用户名"
                v-model="user.name"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-input input-pass"
                placeholder="密码"
                v-model="user.password"
              />
            </div>
            <div class="form-group form-btn-warp">
              <button class="form-btn" type="button" @click="login">
                登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import Vue from "vue";
const Login = Vue.extend({
  template: "#login",
  name: "login",
  data() {
    return {
      user: {
        name: "",
        avatarUrl: "http://q.qlogo.cn/headimg_dl?dst_uin=956411241&spec=100",
        password:"",
        userId:2,
      },
      avatarList: [
        "http://q.qlogo.cn/headimg_dl?dst_uin=705597001&spec=100",
        "http://q.qlogo.cn/headimg_dl?dst_uin=956411241&spec=100",
      ],
      isShow: false,
    };
  },
  methods: {
    toggleAvatarSelect() {
      if (this.isShow) {
        this.isShow = false;
        document.removeEventListener("click", this.hideAvatarSelect);
      } else {
        this.isShow = true;
        document.addEventListener("click", this.hideAvatarSelect);
      }
    },
    hideAvatarSelect() {
      this.isShow = false;
      document.removeEventListener("click", this.hideAvatarSelect);
    },
    login() {
      console.log('login info:',this.user)
      this.$emit("loginResult",this.user);
    },
  },
});

export default Login;
</script>
