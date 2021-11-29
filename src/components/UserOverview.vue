<template>
  <Card id="userFilters">
    <template #title> Filter users </template>
    <template #content>
      <div class="twoEqualRows">
        <div class="firstRow spaceAround">
          <div class="twoEqualRows">
            <h3 class="filterLabel">Id</h3>
            <InputNumber
              class="secondRow height2p5"
              v-model="filterValues.id"
              showButtons
              :min="1"
            />
          </div>

          <div class="twoEqualRows">
            <h3 class="filterLabel">First Name</h3>
            <InputText
              class="secondRow width15 height2p5"
              v-model="filterValues.firstName"
            />
          </div>

          <div class="twoEqualRows">
            <h3 class="filterLabel">Surname</h3>
            <InputText
              class="secondRow width15 height2p5"
              v-model="filterValues.surname"
            />
          </div>
        </div>

        <div class="secondRow spaceAround marginTop1">
          <div class="twoEqualRows">
            <h3 class="filterLabel">Creation date: from</h3>
            <Calendar
              class="secondRow width15 height2p5"
              v-model="filterValues.creationFrom"
              dateFormat="dd.mm.yy"
              :showButtonBar="true"
            />
          </div>

          <div class="twoEqualRows">
            <h3 class="filterLabel">Creation date: to</h3>
            <Calendar
              class="secondRow width15 height2p5"
              v-model="filterValues.creationTo"
              dateFormat="dd.mm.yy"
              :showButtonBar="true"
            />
          </div>

          <div class="twoEqualRows">
            <h3 class="filterLabel">Status</h3>
            <Dropdown
              class="secondRow width15 height2p5"
              v-model="filterValues.status"
              :options="statuses"
              placeholder="Select status"
            />
          </div>

          <div>
            <Button
              class="height2p5 p-button-primary"
              label="Filter"
              @click="applyFilters"
              icon="pi pi-search"
              iconPos="right"
            />
            <Button
              class="height2p5 p-button-warning"
              label="Clear filters"
              @click="discardFilters"
              icon="pi pi-times"
              iconPos="right"
            />
          </div>
        </div>
      </div>
    </template>
  </Card>

  <Card id="userOverviewCard">
    <template #header>
      <h1 class="cardHeading">User overview</h1>
    </template>

    <template #title>
      <router-link to="/newUser">
        <Button
          label="New User"
          class="margin-right-3 p-button-info"
          icon="pi pi-user-plus"
          iconPos="right"
        />
      </router-link>

      <div v-if="!selectedUser" class="inline margin-left-3">
        <Button
          label="Edit User"
          id="Obtn1"
          class="p-button-success"
          icon="pi pi-pencil"
          iconPos="right"
          disabled
        />
        <Button
          label="Flip status"
          id="Obtn2"
          class="p-button-secondary"
          icon="pi pi-sync"
          iconPos="right"
          disabled
        />
        <Button
          label="Delete User"
          class="p-button-danger"
          icon="pi pi-user-minus"
          iconPos="right"
          disabled
        />
      </div>

      <div v-if="selectedUser" class="inline margin-left-3">
        <router-link to="/editUser">
          <Button
            label="Edit User"
            id="Obtn1"
            class="p-button-success"
            icon="pi pi-pencil"
            iconPos="right"
          />
        </router-link>
        <Button
          label="Flip status"
          id="Obtn2"
          @click="flipStatus"
          class="p-button-secondary"
          icon="pi pi-sync"
          iconPos="right"
        />
        <ConfirmPopup></ConfirmPopup>
        <Button
          label="Delete User"
          @click="deleteUser"
          class="p-button-danger"
          icon="pi pi-user-minus"
          iconPos="right"
        />
      </div>
    </template>

    <template id="overviewCardContent" #content>
      <DataTable
        :value="users"
        v-model:selection="selectedUser"
        :lazy="true"
        :paginator="true"
        :rows="10"
        ref="dt"
        :totalRecords="totalRecords"
        :loading="loading"
        @page="onPage($event)"
        @sort="onSort($event)"
        responsiveLayout="scroll"
        removableSort
        dataKey="id"
        selectionMode="single"
      >
        <Column field="id" header="Id" ref="id" :sortable="true" />
        <Column
          field="firstName"
          header="First name"
          ref="country.name"
          :sortable="true"
        />
        <Column
          field="surname"
          header="Surname"
          ref="company"
          :sortable="true"
        />
        <Column
          field="status"
          header="Status"
          ref="representative.name"
          :sortable="true"
        />
        <Column field="email" header="Email" ref="company" :sortable="true" />
        <Column
          field="telephone"
          header="Telephone"
          ref="company"
          :sortable="true"
        />
        <Column
          field="creationDate"
          header="Creation Date"
          ref="company"
          :sortable="true"
        />
      </DataTable>
    </template>
  </Card>
</template>

<script>
import Card from "primevue/card";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ConfirmPopup from "primevue/confirmpopup";

export default {
  name: "UserOvierview",
  components: {
    Card,
    InputNumber,
    InputText,
    Calendar,
    Dropdown,
    Button,
    DataTable,
    Column,
    ConfirmPopup,
  },
  props: {
    user: null,
  },
  emits: ["userSelected", "requestingUserData"],
  watch: {
    selectedUser: function sendSelectedUserToApp() {
      this.$emit("userSelected", this.selectedUser);
    },
  },
  data() {
    return {
      filterValues: {
        id: null,
        firstName: null,
        surname: null,
        creationFrom: null,
        creationTo: null,
        status: null,
      },
      confirmedFilters: {
        id: null,
        firstName: null,
        surname: null,
        creationFrom: null,
        creationTo: null,
        status: null,
      },
      statuses: ["Any status", "Active", "Deactivated"],
      loading: false,
      totalRecords: 0,
      users: null,
      lazyParams: {},
      selectedUser: null,
      sortField: null,
      sortOrder: null,
      thing: "hey theerreee",
    };
  },
  mounted() {
    // this.loading = true;

    this.lazyLoadFirstPage();
  },
  methods: {
    loadLazyData() {
      this.loading = true;

      fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.lazyParams),
      })
        .then((response) => response.json())
        .then((data) => {
          //here im just assigning the array of users that we got from the backend into 'this.users', but also im using array.map on that array so that I can overwrite the creationDate property of each user (to re-format it into dd-MM-yyyy format)
          this.users = data[0].map((element) => {
            return {
              ...element,
              creationDate:
                element.creationDate.substring(8, 10) +
                "-" +
                element.creationDate.substring(5, 7) +
                "-" +
                element.creationDate.substring(0, 4),
            };
          });
          this.totalRecords = data[1];
          this.loading = false;
        });
    },
    onPage(event) {
      this.lazyParams = {
        first: event.first,
        rows: 10,
        filters: this.confirmedFilters, //TODO ON BACKEND
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      };
      this.loadLazyData();
    },
    onSort(event) {
      if (this.sortField !== event.sortField) {
        this.sortField = event.sortField;
        this.sortOrder = 1;
        this.lazyLoadFirstPage();
      } else if (this.sortOrder === 1) {
        this.sortOrder = -1;
        this.lazyLoadFirstPage();
      } else {
        this.sortField = null;
        this.sortOrder = null;
        this.lazyLoadFirstPage();
      }
      //set this.sortfield and this.sortorder according to what happened in the event, what the user did/selected

      this.lazyParams = {
        first: 0,
        rows: 10,
        filters: this.confirmedFilters,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      };
      this.loadLazyData();
    },
    filter() {
      //ask backend how many totalrecords there are after the filter is applied, assign that to this.totalrecords
    },
    applyFilters() {
      this.confirmedFilters.id = this.filterValues.id;
      this.confirmedFilters.firstName = this.filterValues.firstName;
      this.confirmedFilters.surname = this.filterValues.surname;
      this.confirmedFilters.creationFrom = this.filterValues.creationFrom; //TODO - codemissing
      this.confirmedFilters.creationTo = this.filterValues.creationTo; //TODO - line not complete
      this.filterValues.status === "Any status"
        ? (this.confirmedFilters.status = null)
        : (this.confirmedFilters.status = this.filterValues.status);

      this.lazyLoadFirstPage();
    },
    discardFilters() {
      this.filterValues.id = this.confirmedFilters.id = null;
      this.filterValues.firstName = this.confirmedFilters.firstName = null;
      this.filterValues.surname = this.confirmedFilters.surname = null;
      this.filterValues.creationFrom = this.confirmedFilters.creationFrom =
        null;
      this.filterValues.creationTo = this.confirmedFilters.creationTo = null;
      this.filterValues.status = this.confirmedFilters.status = null;

      this.lazyLoadFirstPage();
    },
    lazyLoadFirstPage() {
      this.lazyParams = {
        first: 0,
        rows: 10,
        filters: this.confirmedFilters,
        sortField: this.sortField, //TODO date values might need adjusting
        sortOrder: this.sortOrder, //TOFO
      };

      this.loadLazyData();
    },
    flipStatus() {
      fetch(
        `http://localhost:8080/user.status?userId=${this.selectedUser.id}`,
        {
          method: "PATCH",
        }
      ).then((response) => {
        if (response.status === 200) {
          this.loadLazyData();
        }
      });
    },
    deleteUser(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: `Are you sure you want to delete ${this.selectedUser.firstName} ${this.selectedUser.surname}?`,
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          fetch(`http://localhost:8080/user?userId=${this.selectedUser.id}`, {
            method: "DELETE",
          }).then((response) => {
            if (response.status === 200) {
              this.loadLazyData();
            }
          });
          this.selectedUser = null;
        },
      });
    },
  },
};
</script>

<style>
#userFilters {
  width: 70rem;
  margin: 3rem auto;
}
.twoEqualRows {
  display: grid;
  grid-template-rows: 50% 50%;
}
.firstRow {
  grid-row-start: 1;
}
.secondRow {
  grid-row-start: 2;
}
.inline {
  display: inline;
}
.filterLabel {
  grid-row-start: 1;
  display: inline;
  height: 2rem;
  margin: 0;
}
#userOverviewCard {
  width: 80rem;
  margin: 0 auto;
}
.width {
  width: 5rem;
}
.width15 {
  width: 15rem;
}
.height2p5 {
  height: 2.5rem;
}
.marginTop1 {
  margin-top: 1rem;
}
.spaceAround {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}
.cardHeading {
  margin: 0 0 0 1rem;
  padding-top: 1rem;
}
.margin-left-3 {
  margin-left: 3rem;
}
#Obtn1,
#Obtn2 {
  margin-right: 0.5rem;
}
</style>