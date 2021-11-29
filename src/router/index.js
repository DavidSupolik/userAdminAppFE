import { createRouter, createWebHistory } from "vue-router";
import UserOverview from '../components/UserOverview.vue'
import EditUser from '../components/EditUser.vue';
import NewUser from '../components/NewUser.vue';

const routes = [
    {
        path: '/',
        name: 'UserOverview',
        component: UserOverview,
    },
    {
        path: '/newUser',
        name: 'NewUser',
        component: NewUser,
    },
    {
        path: '/editUser',
        name: 'EditUser',
        component: EditUser,
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;