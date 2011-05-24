class Api::V1::UsersController < ApplicationController
  def auth
    if params[:login] == 'jn0000' && params[:password] == 'outback'
      render :json => {'login' => 'jn0000', 'name' => 'Demo User', 'token' => '0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21'}
    else
      render :json => {}, :status => 401
    end
  end
end
