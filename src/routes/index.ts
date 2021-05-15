import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
			path: '/',
      name: 'Layout',
			component: () => import('../views/Layout/Layout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/Home/Home.vue')
        },
        {
          path: 'detail/:id',
          name: 'detail',
          component: () => import('../views/Detail/Detail.vue')
        }
      ]
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/Editor/Editor.vue')
    }
  ]
})

export default router
