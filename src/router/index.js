import { createRouter, createWebHistory } from 'vue-router'
import { BACKEND_API_URL } from '../config'

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Вход',
            public: true
        },
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: 'Регистрация',
            public: true
        },
        component: () => import('../views/Register.vue')
    },
    {
        path: '/',
        name: 'home',
        meta: {
            title: 'Главная'
        },
        component: () => import('../views/Home.vue')
    },
    {
        path: '/structure',
        name: 'structure',
        meta: {
            title: 'Структура'
        },
        component: () => import('../views/Structure.vue')
    },
    {
        path: '/rewards',
        name: 'rewards',
        meta: {
            title: 'Вознаграждения'
        },
        component: () => import('../views/Rewards.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        meta: {
            title: 'Личный кабинет'
        },
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/personals',
        name: 'personals',
        meta: {
            title: 'Личники'
        },
        component: () => import('../views/Personals.vue')
    },
    {
        path: '/catalog',
        name: 'catalog',
        meta: {
            title: 'Каталог'
        },
        component: () => import('../views/Catalog.vue')
    },
    {
        path: '/orders',
        name: 'orders',
        meta: {
            title: 'Заказы'
        },
        component: () => import('../views/Orders.vue')
    },
    {
        path: '/sanctions',
        name: 'sanctions',
        meta: {
            title: 'Санкции'
        },
        component: () => import('../views/Sanctions.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        meta: {
            title: 'Страница не найдена',
            public: true
        },
        component: () => import('../views/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path) && !to.meta?.public;
    const token = localStorage.getItem('access_token');

    if (authRequired && !token) {
        return next('/login');
    }

    if (authRequired && token) {
        try {
            const response = await fetch(`${BACKEND_API_URL}/api/auth/validate-token`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Token invalid');
            }
        } catch (error) {
            localStorage.removeItem('access_token');
            return next('/login');
        }
    }

    next();
});

export default router
