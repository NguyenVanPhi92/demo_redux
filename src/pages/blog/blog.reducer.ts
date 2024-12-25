import { createAction, createReducer, current, nanoid } from '@reduxjs/toolkit'
import { Post } from '../../@types/blog.type'
import { initialPostList } from '../../constants/blog'

interface BlogState {
    postList: Post[]
    editingPost: Post | null
}

// tạo store state cho Blog
const initialState: BlogState = {
    postList: initialPostList,
    editingPost: null
}

// tạo actions
// dùng prepare callback để tùy chình payload action                    // dùng Omit loại bỏ trường dữ liệu id ra khỏi Post
export const addPost = createAction('blog/addPost', function (post: Omit<Post, 'id'>) {
    return {
        payload: {
            ...post,
            id: nanoid()
        }
    }
})
export const deletePost = createAction<String>('blog/deletePost') // truyền vào id -> string
export const startEditingPost = createAction<String>('blog/startEditingPost') // truyền vào id -> string
export const cancelEditingPost = createAction('blog/cancelEditingPost') // truyền vào id -> string
export const finishEditingPost = createAction<Post>('blog/finishEditingPost') //  truyền vào Post -> {}

// tạo reducer khi dispatch 1 action lên store
const blogReducer = createReducer(initialState, builder => {
    builder
        .addCase(addPost, (state, action) => {
            state.postList.push(action.payload)
        })
        .addCase(deletePost, (state, action) => {
            const postId = action.payload
            const foundPostIndex = state.postList.findIndex(post => post.id === postId)

            if (foundPostIndex !== -1) state.postList.splice(foundPostIndex, 1)
        })
        .addCase(startEditingPost, (state, action) => {
            const postId = action.payload
            const foundPost = state.postList.find(post => post.id === postId) || null
            state.editingPost = foundPost
        })
        .addCase(cancelEditingPost, state => {
            state.editingPost = null
        })
        .addCase(finishEditingPost, (state, action) => {
            const postId = action.payload.id
            state.postList.some((post, index) => {
                if (post.id === postId) {
                    state.postList[index] = action.payload
                    return true
                }

                return false
            })

            state.editingPost = null
        })
    // .addMatcher(
    //     action => action.type.includes('cancel'),
    //     (state, action) => {
    //         console.log(current(state))
    //     }
    // )
})

export default blogReducer
