import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from '@/constants/routes'
import HomeView from '@/views/HomeView.vue'
import PostListView from '@/views/PostListView.vue'
import PostCreateView from '@/views/PostCreateView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import PostEditView from '@/views/PostEditView.vue'
import MapView from '@/views/MapView.vue'
import FestivalCalendarView from '@/views/FestivalCalendarView.vue'
import FavoritesView from '@/views/FavoritesView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView
  },
  {
    path: '/posts',
    name: ROUTE_NAMES.POSTS,
    component: PostListView
  },
  {
    path: '/posts/new',
    name: ROUTE_NAMES.POST_CREATE,
    component: PostCreateView
  },
  {
    path: '/posts/:id',
    name: ROUTE_NAMES.POST_DETAIL,
    component: PostDetailView,
    props: true
  },
  {
    path: '/posts/:id/edit',
    name: ROUTE_NAMES.POST_EDIT,
    component: PostEditView,
    props: true
  },
  {
    path: '/map',
    name: ROUTE_NAMES.MAP,
    component: MapView
  },
  {
    path: '/festivals',
    name: ROUTE_NAMES.FESTIVALS,
    component: FestivalCalendarView
  },
  {
    path: '/favorites',
    name: ROUTE_NAMES.FAVORITES,
    component: FavoritesView
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: NotFoundView
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
