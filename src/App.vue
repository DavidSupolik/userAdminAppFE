<template>
<router-view :user="requestedUserData" @userSelected="updateSelectedUser" @requestingUserData="assignToRequestedUserData" />
</template>

<script>

export default {
  name: "App",
  data() {
    return {
      selectedUser: null,
      requestedUserData: null,
    }
  },
  methods: {
    updateSelectedUser(emittedUser) {
      this.selectedUser = emittedUser;
    },
    assignToRequestedUserData() {
      this.requestedUserData = this.selectedUser;
    }
  }
}
</script>

<style>
html {
  font-size: 100%;
}
body {
  background-color: rgb(230, 230, 230);
}
</style>
