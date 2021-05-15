<template>
   <header class="header-wrapper">
    <a-row type="flex" justify="space-between" align="middle">
      <div class="shape">Lego</div>
      <a-row type="flex" class="header-tab">
        <router-link to="/">首页</router-link>
        <router-link to="/editor">进入编辑器</router-link>
        <a-dropdown class="tab-item">
          <a @click.prevent>
            用户
            <DownOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>个人中心</a-menu-item>
              <a-menu-item>登出</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-row>
    </a-row>
   </header>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    DownOutlined
  },
  setup () {
    return {

    }
  }
})
</script>

<style lang='scss' scoped>
.header-wrapper {
  padding: 0 30px;
  font-size: 14px;
  color: #fff !important;
  // background-color: rgba(0, 0, 0, .5);
  box-shadow: 0 5px 10px rgba(0, 0, 0, .5);
  .shape {
    width: 100px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #000;
    // background-color: chartreuse;
  }
  .header-tab {
    a {
      height: 44px;
      margin: 0 10px;;
      line-height: 44px;
    }
  }
}
</style>
