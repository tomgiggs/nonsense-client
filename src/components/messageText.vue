<script>
import Vue from 'vue'
import mapData from '../utils/emotions'
import mixin from './mixin.vue'
const MessageText = Vue.extend({
  props: {
    text: {
      type: String,
      default: "",
    },
  },
  render(h) {
    const reg = /\[.*?\]/g;
    let result = this.text.replace(reg, (word) => {
      return "|" + word + "|";
    });
    let arr = result.split("|");
    return h(
      "span",
      arr.map((item) => {
        if (reg.test(item) && mapData[item]) {
          return h("img", {
            class: "expression-img",
            attrs: {
              src: mixin.data().baseUrl + mapData[item],
            },
          });
        } else {
          return item;
        }
      })
    );
  },
});
export default MessageText;
</script>