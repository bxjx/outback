class OutbackController < ApplicationController
  def index
  end

  def manifest
    render :layout => false, :content_type => 'text/cache-manifest'
  end
end
