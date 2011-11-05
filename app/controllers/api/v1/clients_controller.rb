require 'faker'
class Api::V1::ClientsController < ApplicationController
  before_filter :check_token

  def caseload
    render :json => (1..rand(20)).map{|i| fake_client(i)}
  end

  protected

  def check_token
    unless params[:token] == '0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21'
      render(:json => [fake_client], :status => 401)
    end
  end

  def fake_client(id)
    {
      :id => id,
      :first_name => Faker::Name.first_name,
      :last_name => Faker::Name.last_name,
      :jsid => rand(10000000),
      :preferred_name => [Faker::Name.first_name, nil, nil].rand,
      :phone_home => "0280909001",
      :phone_mobile => ('04%08d' % rand(100000000)),
      :preferred_phone => "0280909000",
      :preferred_email => 'info@jnsolutions.com.au',
      :email => Faker::Internet.free_email,
      :crn => rand(100),
      :contacts => [
        {:notes => Faker::Lorem.paragraph, :created_at => 6.days.ago},
        {:notes => Faker::Lorem.paragraph, :created_at => 12.days.ago}
      ]
    }
  end
end

