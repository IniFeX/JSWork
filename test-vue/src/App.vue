<template>
  <div class="app">
    <post-form
      @create="createPost"
    />
    <post-list
      :posts="posts"
      @remove="removePost"
    />
  </div>
</template>

<script>
import PostForm from "./components/PostForm.vue";
import PostList from "./components/PostList.vue";

export default {
  components: {
    PostForm,
    PostList,
  },
  data() {
    return {
      posts: [
        { id: 1, title: "Vue JS", body: "vue description" },
        { id: 2, title: "Vue JS 2", body: "vue description" },
        { id: 3, title: "Vue JS 3", body: "vue description" },
      ],
    };
  },
  methods: {
    createPost(post){
      this.posts.push(post);
    },
    removePost(post){
      this.posts = this.posts.filter(p => p.id !== post.id);
    }
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.app {
  padding: 10px;
}
</style>
