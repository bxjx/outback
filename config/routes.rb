Outback::Application.routes.draw do

  root :to => 'outback#index'
  match '/manifest', {:controller => 'outback', :action =>'manifest'}

  namespace :api do
    namespace :v1 do
      resources :users do
        collection do
          get 'auth'
          post 'auth'
          get 'ping'
        end
      end
      resources :clients do
        collection do
          get 'caseload'
          put 'caseload'
          get 'reset'
        end
      end
    end
  end
end
