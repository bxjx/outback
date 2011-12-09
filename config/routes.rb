Outback::Application.routes.draw do

  # Serve off subdirectory if set
  scope ENV['RAILS_RELATIVE_URL_ROOT'] || '/' do

    root :to => 'outback#index'
    match '/manifest', {:controller => 'outback', :action =>'manifest'}

  end

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
