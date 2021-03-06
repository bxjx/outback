require 'faker'
class Api::V1::ClientsController < ApplicationController
  before_filter :check_token, :except => :reset
  before_filter :setup_fake_clients

  # Return dump of clients on caseload. Update the contacts if submitted with
  # JSON data
  def caseload
    fake_clients = get_fake_clients
    clients_data = params["_json"]
    if clients_data
      clients_data.each do |client_data|
        client = fake_clients.detect{|c| c[:id].to_s == client_data[:id].to_s }
        if client && client_data[:contacts]
          client_data[:contacts].each do |contact_data|
            contact = client[:contacts].detect{|c| c[:uid] == contact_data[:uid]}
            if !contact
              contact_data[:user_name] = 'Demo User'
              client[:contacts].unshift(contact_data)
            else
              contact[:synced] = true
            end
          end
        end
      end
      Rails.cache.write('clients', fake_clients)
    end
    sleep(5)
    render :json => get_fake_clients
  end

  def reset
    populate_fake_clients
    render :text => 'done!'
  end

  protected

  def check_token
    unless params[:token] == '0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21'
      render(:json => [], :status => 401)
    end
  end

  def get_fake_clients
    Rails.cache.read('clients')
  end

  def setup_fake_clients
    unless get_fake_clients
      populate_fake_clients
    end
  end

  def populate_fake_clients
    Rails.cache.write('clients', (1..500).map{|i| fake_client(i)})
  end

  def fake_client(id)
    in_work_experience = [true,false].sample # probably a better way to do this ;)
    client = {
      :id => id,
      :first_name => Faker::Name.first_name,
      :last_name => Faker::Name.last_name,
      :jsid => rand(10000000),
      :preferred_name => [Faker::Name.first_name, nil, nil].sample,
      :phone_home => "0280909001",
      :phone_mobile => ('04%08d' % rand(100000000)),
      :preferred_phone => "0280909000",
      :preferred_email => 'info@jnsolutions.com.au',
      :email => Faker::Internet.free_email,
      :residential_address => Faker::Address.street_address,
      :residential_suburb => Faker::Address.street_address, 
      :residential_state => ['NSW', 'VIC'].sample, 
      :residential_postcode => ['2000', '2001'].sample,
      :crn => rand(100),
      :stream_summary => "#{[1,2,3,4].sample} on #{2.days.ago.to_date.strftime('%d/%m/%Y')}",
      :in_work_experience? => in_work_experience,
      :work_experience_summary => (in_work_experience ? "Placed 21/12/2011" : nil),
      :activity_tested? => [true,false].sample,
      :contacts => rand(20).times.map{|number|
        {:notes => Faker::Lorem.paragraph, :created_at => number.days.ago, :synced => true, :user_name => Faker::Name.name}
      }
    }
    if id.odd?
      client[:epp] = {
        :signed_on => Date.yesterday,
        :interpreter => false,
        :goal => Faker::Lorem.paragraph,
        :work_experience_hours_required => true,
        :work_experience_hours => 12,
        :activities => [
          {
            :name => 'Compulsory Contact Appointment',
            :category => 'Some cat',
            :code => 'AI03',
            :compulsory => true,
            :completed_statement => Faker::Lorem.paragraph
          },
          {
            :name => 'Blah Blah',
            :code => 'JS01',
            :category => 'Some cat',
            :compulsory => false,
            :completed_statement => Faker::Lorem.paragraph
          },
        ],
        :assistances => [
          {
            :name => 'Compulsory Contact Appointment',
            :code => 'Work Related Clothing and Presentation Assistance',
            :details => Faker::Lorem.paragraph
          },
        ],
        :barriers => [
          {
            :name => 'Compulsory Contact Appointment',
            :category => 'Compulsory',
            :code => 'Work Related Clothing and Presentation Assistance',
            :status => "Mild",
            :result => "Unsure",
            :additional => Faker::Lorem.paragraph
          },
        ]
      }
    end
    client
  end
end

