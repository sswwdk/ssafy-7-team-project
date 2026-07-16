import { ref } from 'vue'
import { SELECTED_REGION } from '@/constants/region'
import {
  createPost as createStoredPost,
  deletePost as deleteStoredPost,
  getPostById,
  getPosts,
  togglePostRecommendation,
  updatePost as updateStoredPost
} from '@/services/postStorageService'

const posts = ref([])

export function usePosts() {
  function refreshPosts() {
    posts.value = getPosts()
    return posts.value
  }

  function findPost(postId) {
    return getPostById(postId)
  }

  function createPost(input) {
    const post = createStoredPost({
      ...input,
      region: SELECTED_REGION.code
    })
    refreshPosts()
    return post
  }

  function updatePost(postId, input) {
    const post = updateStoredPost(postId, input, input.password)
    refreshPosts()
    return post
  }

  function removePost(postId, password) {
    const post = deleteStoredPost(postId, password)
    refreshPosts()
    return post
  }

  function toggleRecommendation(postId) {
    const post = togglePostRecommendation(postId)
    refreshPosts()
    return post
  }

  return {
    posts,
    refreshPosts,
    findPost,
    createPost,
    updatePost,
    removePost,
    toggleRecommendation
  }
}
