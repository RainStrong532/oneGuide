import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reducers from '../reducers'
import thunkMiddleware from 'redux-thunk'

// import { createLogger } from 'redux-logger'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth', 'user' , 'tour_guide_user']    // moi them tour_guide_user 6/8 
}

// Store
const configureStore = (reducers) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(
      thunkMiddleware
    ),
  );
  return createStore(reducers, enhancer);
};

const persistedReducer = persistReducer(persistConfig, reducers)
const store = configureStore(persistedReducer)
persistStore(store)

const dispatchAction = (action) => {
  store.dispatch(action)
}

const getStore = () => {
  return store
}

export { getStore, dispatchAction };
