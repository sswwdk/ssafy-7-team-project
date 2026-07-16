import { POST_STORAGE_KEY } from '@/constants/storage'

const DUMMY_POSTS = Object.freeze([
  {
    id: 'dummy-post-20260701',
    region: '종로구',
    category: 'festival',
    title: '7월 서울 축제 같이 가실 분 구해요',
    content: '이번 달 서울에서 열리는 축제 중 함께 방문할 분을 찾습니다.',
    password: '1234',
    isRecommended: true,
    recommendationCount: 5,
    comments: [
      createDummyComment(
        'dummy-comment-20260701-1',
        '저도 토요일 오후라면 함께하고 싶어요. 북촌 쪽 축제도 궁금하네요.',
        '2026-07-01T09:14:00+09:00',
        [
          createDummyReply(
            'dummy-reply-20260701-1',
            '좋아요! 일정 정리해서 다시 댓글 남길게요.',
            '2026-07-01T09:22:00+09:00'
          )
        ]
      ),
      createDummyComment(
        'dummy-comment-20260701-2',
        '이번 주말 비 소식이 있어서 실내 행사도 같이 보면 좋겠어요.',
        '2026-07-01T10:03:00+09:00'
      ),
      createDummyComment(
        'dummy-comment-20260701-3',
        '참여 인원 정해지면 댓글 남겨주세요!',
        '2026-07-01T10:18:00+09:00'
      )
    ],
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
    isRecommended: true,
    recommendationCount: 4,
    comments: [
      createDummyComment(
        'dummy-comment-20260704-1',
        '덕수궁 돌담길에서 출발해서 정동길로 이어지는 코스 추천해요.',
        '2026-07-04T11:42:00+09:00',
        [
          createDummyReply(
            'dummy-reply-20260704-1',
            '카페도 들르기 좋은 동선인가요?',
            '2026-07-04T11:49:00+09:00'
          ),
          createDummyReply(
            'dummy-reply-20260704-2',
            '네, 정동극장 근처에 조용한 카페가 많아요.',
            '2026-07-04T11:56:00+09:00'
          )
        ]
      ),
      createDummyComment(
        'dummy-comment-20260704-2',
        '서울시립미술관 전시 보고 서울광장까지 걸어도 좋아요.',
        '2026-07-04T12:08:00+09:00'
      ),
      createDummyComment(
        'dummy-comment-20260704-3',
        '주말에는 사람이 많으니 오전 일찍 가는 걸 추천합니다.',
        '2026-07-04T12:31:00+09:00'
      )
    ],
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
    isRecommended: true,
    recommendationCount: 3,
    comments: [
      createDummyComment(
        'dummy-comment-20260707-1',
        '혼밥이면 지하 식당가에 있는 국수집이 부담 없고 빨라요.',
        '2026-07-07T13:11:00+09:00'
      ),
      createDummyComment(
        'dummy-comment-20260707-2',
        '조금 걸어도 괜찮으면 봉은사역 쪽 덮밥집도 괜찮습니다.',
        '2026-07-07T13:24:00+09:00',
        [
          createDummyReply(
            'dummy-reply-20260707-1',
            '웨이팅은 긴 편인가요?',
            '2026-07-07T13:29:00+09:00'
          )
        ]
      ),
      createDummyComment(
        'dummy-comment-20260707-3',
        '코엑스몰 푸드코트도 혼자 먹기 편해서 자주 가요.',
        '2026-07-07T13:47:00+09:00'
      ),
      createDummyComment(
        'dummy-comment-20260707-4',
        '점심시간 조금만 피하면 대부분 자리 있습니다.',
        '2026-07-07T14:02:00+09:00'
      )
    ],
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
    isRecommended: true,
    recommendationCount: 6,
    comments: [
      createDummyComment(
        'dummy-comment-20260711-1',
        '후기 감사합니다. 다음 공연은 예술의전당 쪽도 보고 계신가요?',
        '2026-07-11T16:35:00+09:00'
      ),
      createDummyComment(
        'dummy-comment-20260711-2',
        '저도 같은 공연 봤는데 앵콜 무대가 특히 좋았어요.',
        '2026-07-11T16:51:00+09:00',
        [
          createDummyReply(
            'dummy-reply-20260711-1',
            '맞아요. 다음 일정도 예매하려고요.',
            '2026-07-11T17:02:00+09:00'
          )
        ]
      ),
      createDummyComment(
        'dummy-comment-20260711-3',
        '공연장 근처 저녁 식사할 곳도 추천받고 싶네요.',
        '2026-07-11T17:18:00+09:00'
      )
    ],
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
    isRecommended: true,
    recommendationCount: 4,
    comments: [
      createDummyComment(
        'dummy-comment-20260715-1',
        '망원한강공원 쪽은 해 질 무렵 분위기가 정말 좋아요.',
        '2026-07-15T18:12:00+09:00'
      ),
      createDummyComment(
        'dummy-comment-20260715-2',
        '저도 8시쯤 산책 예정인데 같이 걸어도 좋겠습니다.',
        '2026-07-15T18:26:00+09:00',
        [
          createDummyReply(
            'dummy-reply-20260715-1',
            '좋아요. 망원나들목 근처에서 보면 될까요?',
            '2026-07-15T18:31:00+09:00'
          ),
          createDummyReply(
            'dummy-reply-20260715-2',
            '네, 도착하면 댓글로 알려주세요!',
            '2026-07-15T18:35:00+09:00'
          )
        ]
      ),
      createDummyComment(
        'dummy-comment-20260715-3',
        '바람이 좀 불 수 있으니 가벼운 겉옷 챙기세요.',
        '2026-07-15T18:43:00+09:00'
      ),
      createDummyComment(
        'dummy-comment-20260715-4',
        '저녁 산책 모임 자주 열리면 참여하고 싶어요.',
        '2026-07-15T18:56:00+09:00'
      )
    ],
    createdAt: '2026-07-15T18:00:00+09:00',
    updatedAt: '2026-07-15T18:00:00+09:00'
  }
])

function createDummyComment(id, content, createdAt, replies = []) {
  return {
    id,
    content,
    password: '1234',
    createdAt,
    updatedAt: createdAt,
    replies
  }
}

function createDummyReply(id, content, createdAt) {
  return {
    id,
    content,
    password: '1234',
    createdAt,
    updatedAt: createdAt
  }
}

function createPostId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function createCommentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `comment-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function addMissingDummyPosts(posts) {
  const existingIds = new Set(posts.map((post) => post.id))
  const dummyPostsById = new Map(DUMMY_POSTS.map((post) => [post.id, post]))
  let hasUpdatedDefaults = false
  const postsWithDefaultData = posts.map((post) => {
    const defaultPost = dummyPostsById.get(post.id)

    if (!defaultPost) {
      return post
    }

    const needsRecommendationDefaults =
      post.recommendationCount === undefined || post.isRecommended === undefined
    const needsCommentDefaults = post.comments === undefined

    if (!needsRecommendationDefaults && !needsCommentDefaults) {
      return post
    }

    hasUpdatedDefaults = true
    return {
      ...post,
      recommendationCount: post.recommendationCount ?? defaultPost.recommendationCount,
      isRecommended: post.isRecommended ?? defaultPost.isRecommended,
      comments: post.comments ?? defaultPost.comments
    }
  })
  const missingDummyPosts = DUMMY_POSTS.filter((post) => !existingIds.has(post.id)).map((post) => ({
    ...post
  }))

  if (!missingDummyPosts.length && !hasUpdatedDefaults) {
    return posts
  }

  const mergedPosts = [...postsWithDefaultData, ...missingDummyPosts]
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

export function togglePostRecommendation(postId) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  const isRecommended = !posts[postIndex].isRecommended
  const currentCount = Math.max(0, Number(posts[postIndex].recommendationCount) || 0)
  const updatedPost = {
    ...posts[postIndex],
    isRecommended,
    recommendationCount: Math.max(0, currentCount + (isRecommended ? 1 : -1))
  }

  posts.splice(postIndex, 1, updatedPost)
  writePosts(posts)

  return updatedPost
}

export function createComment(postId, input) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  const now = new Date().toISOString()
  const comment = {
    id: createCommentId(),
    content: input.content.trim(),
    password: input.password,
    createdAt: now,
    updatedAt: now
  }

  posts[postIndex] = {
    ...posts[postIndex],
    comments: [...(posts[postIndex].comments || []), comment]
  }
  writePosts(posts)

  return comment
}

export function updateComment(postId, commentId, input, password) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  const comments = posts[postIndex].comments || []
  const commentIndex = comments.findIndex((comment) => comment.id === commentId)

  if (commentIndex < 0) {
    const error = new Error('댓글을 찾을 수 없습니다.')
    error.code = 'COMMENT_NOT_FOUND'
    throw error
  }

  verifyPassword(comments[commentIndex], password)

  const updatedComment = {
    ...comments[commentIndex],
    content: input.content.trim(),
    updatedAt: new Date().toISOString()
  }
  const updatedComments = [...comments]
  updatedComments.splice(commentIndex, 1, updatedComment)
  posts[postIndex] = { ...posts[postIndex], comments: updatedComments }
  writePosts(posts)

  return updatedComment
}

export function deleteComment(postId, commentId, password) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  const comments = posts[postIndex].comments || []
  const commentIndex = comments.findIndex((comment) => comment.id === commentId)

  if (commentIndex < 0) {
    const error = new Error('댓글을 찾을 수 없습니다.')
    error.code = 'COMMENT_NOT_FOUND'
    throw error
  }

  verifyPassword(comments[commentIndex], password)
  const updatedComments = [...comments]
  const [deletedComment] = updatedComments.splice(commentIndex, 1)
  posts[postIndex] = { ...posts[postIndex], comments: updatedComments }
  writePosts(posts)

  return deletedComment
}

export function createReply(postId, commentId, input) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  const comments = posts[postIndex].comments || []
  const commentIndex = comments.findIndex((comment) => comment.id === commentId)

  if (commentIndex < 0) {
    const error = new Error('댓글을 찾을 수 없습니다.')
    error.code = 'COMMENT_NOT_FOUND'
    throw error
  }

  const now = new Date().toISOString()
  const reply = {
    id: createCommentId(),
    content: input.content.trim(),
    password: input.password,
    createdAt: now,
    updatedAt: now
  }
  const updatedComments = [...comments]
  updatedComments[commentIndex] = {
    ...comments[commentIndex],
    replies: [...(comments[commentIndex].replies || []), reply]
  }
  posts[postIndex] = { ...posts[postIndex], comments: updatedComments }
  writePosts(posts)

  return reply
}

export function updateReply(postId, commentId, replyId, input, password) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  const comments = posts[postIndex].comments || []
  const commentIndex = comments.findIndex((comment) => comment.id === commentId)

  if (commentIndex < 0) {
    const error = new Error('댓글을 찾을 수 없습니다.')
    error.code = 'COMMENT_NOT_FOUND'
    throw error
  }

  const replies = comments[commentIndex].replies || []
  const replyIndex = replies.findIndex((reply) => reply.id === replyId)

  if (replyIndex < 0) {
    const error = new Error('대댓글을 찾을 수 없습니다.')
    error.code = 'REPLY_NOT_FOUND'
    throw error
  }

  verifyPassword(replies[replyIndex], password)

  const updatedReply = {
    ...replies[replyIndex],
    content: input.content.trim(),
    updatedAt: new Date().toISOString()
  }
  const updatedReplies = [...replies]
  updatedReplies.splice(replyIndex, 1, updatedReply)
  const updatedComments = [...comments]
  updatedComments[commentIndex] = { ...comments[commentIndex], replies: updatedReplies }
  posts[postIndex] = { ...posts[postIndex], comments: updatedComments }
  writePosts(posts)

  return updatedReply
}

export function deleteReply(postId, commentId, replyId, password) {
  const posts = readPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)

  if (postIndex < 0) {
    const error = new Error('게시글을 찾을 수 없습니다.')
    error.code = 'POST_NOT_FOUND'
    throw error
  }

  const comments = posts[postIndex].comments || []
  const commentIndex = comments.findIndex((comment) => comment.id === commentId)

  if (commentIndex < 0) {
    const error = new Error('댓글을 찾을 수 없습니다.')
    error.code = 'COMMENT_NOT_FOUND'
    throw error
  }

  const replies = comments[commentIndex].replies || []
  const replyIndex = replies.findIndex((reply) => reply.id === replyId)

  if (replyIndex < 0) {
    const error = new Error('대댓글을 찾을 수 없습니다.')
    error.code = 'REPLY_NOT_FOUND'
    throw error
  }

  verifyPassword(replies[replyIndex], password)
  const updatedReplies = [...replies]
  const [deletedReply] = updatedReplies.splice(replyIndex, 1)
  const updatedComments = [...comments]
  updatedComments[commentIndex] = { ...comments[commentIndex], replies: updatedReplies }
  posts[postIndex] = { ...posts[postIndex], comments: updatedComments }
  writePosts(posts)

  return deletedReply
}

export function getPostCommentCount(post) {
  return (post?.comments || []).reduce(
    (count, comment) => count + 1 + (comment.replies?.length || 0),
    0
  )
}
