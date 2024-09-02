<template>
  <div class="app">
    <h1>Page with Posts</h1>
    <div class="add-btn">
      <my-button @click="showDialog">Create Post</my-button>
      <my-select
        v-model="selectedSort"
        :options="sortOptions"
      >

      </my-select>
    </div>
    <my-dialog v-model:show="dialogVisible">
      <post-form
        @create="createPost"
      />
    </my-dialog>

    <post-list
      v-if="!isPostLoading"
      :posts="posts"
      @remove="removePost"
    />
    <div v-else>Fetching Data...</div>
  </div>
</template>

<script>
import PostForm from "./components/PostForm.vue";
import PostList from "./components/PostList.vue";
import MyButton from "@/components/UI/MyButton.vue";
import axios from "axios";
import MySelect from "@/components/UI/MySelect.vue";

export default {
  components: {
    MySelect,
    MyButton,
    // MyDialog,
    PostForm,
    PostList,
  },
  data() {
    return {
      posts: [],
      dialogVisible: false,
      isPostLoading: false,
      selectedSort: "",
      sortOptions: [
        {value: 'title', name: 'By Name'},
        {value: 'body', name: 'By Content'},
      ]
    };
  },
  methods: {
    createPost(post){
      this.posts.push(post);
      this.dialogVisible = false;
    },
    removePost(post){
      this.posts = this.posts.filter(p => p.id !== post.id);
    },
    showDialog(){
      this.dialogVisible = true;
    },
    async fetchPosts(){
      try {
        this.isPostLoading = true;
        setTimeout(async () =>{
          const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10')
          this.posts = response.data;
        }, 1000)
      } catch (e) {
        alert(`Error: ${e}`);
      } finally {
        this.isPostLoading = false;
      }
    }
  },
  mounted() {
    this.fetchPosts()
  }
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
.add-btn{
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
}
</style>
