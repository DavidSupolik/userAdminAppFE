<template>
  <Card class="userCard">
    <template #header>
      <h1 class="cardHeading">Edit User</h1>
    </template>

    <template #content>
      <div class="twoEqualRows">
        <div class="firstRow spaceAround">
          <div class="twoEqualRows">
            <h3 class="filterLabel">First Name</h3>
            <InputText
              class="secondRow width15 height2p5"
              v-model="firstName"
            />
          </div>
          <div class="twoEqualRows">
            <h3 class="filterLabel">Surname</h3>
            <InputText class="secondRow width15 height2p5" v-model="surname" />
          </div>

          <div class="twoEqualRows">
            <h3 class="filterLabel">Status</h3>
            <Dropdown
              class="secondRow width15 height2p5"
              v-model="status"
              :options="statuses"
              placeholder="Select status"
            />
          </div>
        </div>

        <div class="secondRow spaceAround marginTop1">
          <div class="twoEqualRows">
            <h3 class="filterLabel">Email</h3>
            <InputText class="secondRow width15 height2p5" v-model="email" />
          </div>

          <div class="twoEqualRows">
            <h3 class="filterLabel">Telephone</h3>
            <InputNumber
              class="secondRow height2p5"
              v-model="telephone"
              :useGrouping="false"
            />
          </div>

          <Button
            class="height2p5 p-button-primary"
            label="Save changes"
            @click="editUser"
            icon="pi pi-save"
            iconPos="right"
          />

          <router-link to="/">
          <Button
            class="height2p5 p-button-warning"
            label="Cancel"
            icon="pi pi-times"
            iconPos="right"
          />
          </router-link>
        </div>
      </div>
      <div v-if="showFieldsMissing">
        <p>{{ missingFieldsMessage }}</p>
      </div>
      <div v-if="showEmailIncorect">
        <p>Provided email does not have valid format.</p>
      </div>
      <div v-if="showTelephoneIncorect">
        <p>Provided telephone number does not have valid length.</p>
      </div>
      <div v-if="serverError">
        <p>
          Unable to update the user - either no values were editted or an error has occured during server
          communication.
        </p>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

export default {
  name: "EditUser",
  components: {
    Card,
    InputNumber,
    InputText,
    Dropdown,
    Button,
  },
  props: {
    user: null,
  },
  emits: ["requestingUserData"],
  mounted() {
    this.$emit("requestingUserData");
  },
  watch: {
    user: function fillOutFields() {
      this.firstName = this.user.firstName;
      this.surname = this.user.surname;
      this.status = this.user.status;
      this.email = this.user.email;
      this.telephone = this.user.telephone;
    },
  },
  data() {
    return {
      firstName: null,
      surname: null,
      status: null,
      statuses: ["Active", "Deactivated"],
      email: null,
      telephone: null,
      missingFields: [],
      missingFieldsMessage: null,
      showFieldsMissing: false,
      showEmailIncorect: false,
      showTelephoneIncorect: false,
      serverError: false,
    };
  },
  methods: {
    editUser() {
      if (this.validateInput()) {
        fetch("http://localhost:8080/user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: this.user.id,
            firstName: this.firstName,
            surname: this.surname,
            status: this.status,
            email: this.email,
            telephone: this.telephone,
          }),
        }).then((response) => {
          if (response.status === 200) {
            this.$router.push("/");
          } else {
            this.serverError = true;
          }
        });
      }
    },
    validateInput() {
      this.missingFields = [];
      this.missingFieldsMessage = null;
      this.showFieldsMissing = false;
      this.showEmailIncorect = false;
      this.showTelephoneIncorect = false;
      this.serverError = false;

      if (this.firstName === null) {
        this.missingFields.push("First Name");
      }
      if (this.surname === null) {
        this.missingFields.push("Surname");
      }
      if (this.status === null) {
        this.missingFields.push("Status");
      }

      if (this.email === null) {
        this.missingFields.push("Email");
      } else {
        const atIndex = this.email.indexOf("@");
        const dotIndex = this.email.lastIndexOf(".");
        if (
          atIndex < 1 ||
          dotIndex < atIndex + 2 ||
          dotIndex + 2 === this.email.length
        ) {
          this.showEmailIncorect = true;
        }
      }

      if (this.telephone === null) {
        this.missingFields.push("Telephone");
      } else {
        if (this.telephone < 100000000 || this.telephone > 999999999) {
          this.showTelephoneIncorect = true;
        }
      }

      this.missingFieldsMessage = "The following data is missing: ";
      for (let i = 0; i < this.missingFields.length; i++) {
        this.missingFieldsMessage += this.missingFields[i];
        if (i < this.missingFields.length - 1) {
          this.missingFieldsMessage += ", ";
        } else if (i === this.missingFields.length - 1) {
          this.missingFieldsMessage += ".";
        }
      }

      if (this.missingFields.length > 0) {
        this.showFieldsMissing = true;
      }
      if (
        this.missingFields.length > 0 ||
        this.showEmailIncorect === true ||
        this.showTelephoneIncorect === true
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style>
.userCard {
  width: 55rem;
  margin: 5rem auto 0 auto;
}
</style>
