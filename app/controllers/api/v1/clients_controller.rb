class Api::V1::ClientsController < ApplicationController
  before_filter :check_token

  def caseload
    render :json => [
    ]
  end

  protected

  def check_token
    unless params[:token] == '0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21'
      render(:json => [fake_client], :status => 401)
    end
  end

  def fake_client
    {:first_name => 'Julian', :last_name => 'Assange'}
  end
end
