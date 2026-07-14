import { POST_STORAGE_KEY } from '@/constants/storage'

function createPostId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function readPosts() {
  const rawValue = localStorage.getItem(POST_STORAGE_KEY)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch (error) {
    console.error('게시글 저장 데이터를 읽지 못했습니다.', error)
    return []
  }
}

function writePosts(posts) {
  localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts))
}

function verifyPassword(post, password) {
  if (post.password !== password) {
    const error = new Error('비밀번호가 일치하지 않습니다.')
    error.code = 'PASSWORD_MISMATCH'
    throw error
  }
}

export function getPosts() {
  return readPosts().sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
}

export function getPostById(postId) {
  return readPosts().find((post) => post.id === postId) || null
}

export function createPost(input) {
  const now = new Date().toISOString()
  const post = {
    id: createPostId(),
    region: input.region,
    category: input.category,
    title: input.title.trim(),
    content: input.content.trim(),
    password: input.password,
    createdAt: now,
    updatedAt: now
  }

  const posts = readPosts()
  writePosts([post, ...posts])

  return post
}

export function updatePost(postId, input, password) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  verifyPassword(posts[postIndex], password)

  const updatedPost = {
    ...posts[postIndex],
    category: input.category,
    title: input.title.trim(),
    content: input.content.trim(),
    updatedAt: new Date().toISOString()
  }

  posts.splice(postIndex, 1, updatedPost)
  writePosts(posts)

  return updatedPost
}

export function deletePost(postId, password) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  verifyPassword(posts[postIndex], password)
  const [deletedPost] = posts.splice(postIndex, 1)
  writePosts(posts)

  return deletedPost
}
