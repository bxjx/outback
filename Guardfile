guard 'coffeescript', :output => 'spec/javascripts/compiled' do
  watch('^app/assets/javascripts/(.*)\.coffee')
end

guard 'coffeescript', :output => 'spec/javascripts' do
  watch('^spec/javascripts/(.*)\.coffee')
end

guard 'livereload' do
  watch('^spec/javascripts/.+\.js$')
  watch('^public/javascripts/compiled/.+\.js$')
end
