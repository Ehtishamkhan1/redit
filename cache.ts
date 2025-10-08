import { TokenCache } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const createTokenCache =(): TokenCache => {
    return{
        getToken: async (key:string)=>{
            try{ 
                const item=await SecureStore.getItemAsync(key);
              
                return item
             }
            catch( error ){
                console.log(error);
                await SecureStore.deleteItemAsync(key);
                return null
            }
        },

        saveToken: async (key:string, token:string)=>{
            try{
                await SecureStore.setItemAsync(key, token);
            }
            catch( error ){
                console.log(error);
            }
        }
    }
}

export const tokenCache = createTokenCache();