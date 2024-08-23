<template>
  <div v-show="posts.length > 0">
    <h3>List of posts: ({{posts.length}})</h3>
    <post-item
      v-for="post in posts"
      :post="post"
      :key="post.id"
      @remove = "$emit('remove', post)"
    />
  </div>
  <h2 v-show="posts.length === 0" style="color: red">
    LIST OF POSTS IS EMPTY
  </h2>
</template>

<script>
import PostItem from "@/components/PostItem.vue";

export default {
  components: {PostItem},
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
</style>
