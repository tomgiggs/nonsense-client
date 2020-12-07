
<script>
import Vue from 'vue'

const AlterMessage = Vue.extend({
      template:"#alter-message",
      name:"AlterMessage",
      props:{
        msg:{
          type:String,
          default(){
            return ""
          },
        },
        show:{
          type: Boolean,
          default() {
            return false;
          },
        }
      },
      mounted:function () {
        let _this=this;
        this.show=true;
        setTimeout(function () {
          _this.show=false;
        },3000)
      },
      methods:{
        delELe:function () {
          this.$el.remove()
        }
      },
    });

export default AlterMessage;
</script>

  