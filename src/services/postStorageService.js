import { POST_STORAGE_KEY } from '@/constants/storage'

const DUMMY_POSTS = Object.freeze([
  {
    id: 'dummy-post-20260701',
    region: '종로구',
    category: 'festival',
    title: '7월 서울 축제 같이 가실 분 구해요',
    content: '이번 달 서울에서 열리는 축제 중 함께 방문할 분을 찾습니다.',
    password: '1234',
    createdAt: '2026-07-01T09:00:00+09:00',
    updatedAt: '2026-07-01T09:00:00+09:00'
  },
  {
    id: 'dummy-post-20260704',
    region: '중구',
    category: 'travel',
    title: '중구 주말 산책 코스 추천 부탁드려요',
    content: '전시와 카페를 함께 둘러볼 수 있는 중구 산책 코스를 찾고 있어요.',
    password: '1234',
    createdAt: '2026-07-04T11:30:00+09:00',
    updatedAt: '2026-07-04T11:30:00+09:00'
  },
  {
    id: 'dummy-post-20260707',
    region: '강남구',
    category: 'food',
    title: '코엑스 근처 점심 맛집 추천',
    content: '혼자 가기 좋은 코엑스 근처 점심 식당을 추천받고 싶습니다.',
    password: '1234',
    createdAt: '2026-07-07T13:00:00+09:00',
    updatedAt: '2026-07-07T13:00:00+09:00'
  },
  {
    id: 'dummy-post-20260711',
    region: '서초구',
    category: 'festival',
    title: '주말 공연 관람 후기 공유해요',
    content: '서초구에서 본 주말 공연이 좋아서 다음 공연 정보도 찾아보고 있습니다.',
    password: '1234',
    createdAt: '2026-07-11T16:20:00+09:00',
    updatedAt: '2026-07-11T16:20:00+09:00'
  },
  {
    id: 'dummy-post-20260715',
    region: '마포구',
    category: 'free',
    title: '한강 근처 저녁 산책 함께해요',
    content: '오늘 저녁 한강 주변을 가볍게 산책할 분이 있으면 좋겠습니다.',
    password: '1234',
    createdAt: '2026-07-15T18:00:00+09:00',
    updatedAt: '2026-07-15T18:00:00+09:00'
  }
])

function createPostId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function addMissingDummyPosts(posts) {
  const existingIds = new Set(posts.map((post) => post.id))
  const missingDummyPosts = DUMMY_POSTS.filter((post) => !existingIds.has(post.id)).map((post) => ({
    ...post
  }))

  if (!missingDummyPosts.length) {
    return posts
  }

  const mergedPosts = [...posts, ...missingDummyPosts]
  writePosts(mergedPosts)
  return mergedPosts
}

function readPosts() {
  const rawValue = localStorage.getItem(POST_STORAGE_KEY)

  if (!rawValue) {
    return addMissingDummyPosts([])
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? addMissingDummyPosts(parsedValue) : []
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
