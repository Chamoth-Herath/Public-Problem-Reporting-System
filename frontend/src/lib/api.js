import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


// Define a service using a base URL and expected endpoints
export const Api = createApi({
    reducerPath: 'Api',
    baseQuery: fetchBaseQuery({

        baseUrl: 'http://localhost:5000/api',

        prepareHeaders: async (headers) => {
            return new Promise((resolve) => {
                async function checkToken() {
                    const clerk = window.Clerk;
                    if (clerk) {
                        const token = await clerk.session?.getToken();
                        headers.set("Authorization", `Bearer ${token}`);
                        resolve(headers);
                    } else {
                        setTimeout(checkToken, 500);
                    }
                }
                checkToken();
            });
        }



    }),


    endpoints: (build) => ({

    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {  } = Api