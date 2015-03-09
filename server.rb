require 'sinatra'
require 'json'
require 'nokogiri'
require 'curb'

set :bind, '0.0.0.0'

def create_scenario hash
  create_page_object hash
end

def create_page_object hash
  base_str = "class VisualEditorPage
    include PageObject\n"
  mid_string = ''
  i = 0
  hash.each do |f|
    unless f["element"].nil?
      mid_string += "#{f['element'].downcase}(:element_#{i}, css: '#{f['xpath']}')\n"
      i += 1
    end
  end
  end_str = 'end'
  File.write("visual_editor_page.rb", base_str + mid_string + end_str)
end

get '/wiki/References' do
  http = Curl.get("http://en.wikipedia.beta.wmflabs.org/wiki/References?veaction=edit")
  html = Nokogiri::HTML http.body
  html.xpath("//head/*[1]").before("<script src='/extension.js'></script>")
  html.xpath("//body/*[1]").after("<script src='/module.js'></script>")
  html.xpath("//body/*[1]").after("<script src='/angular.js'></script>")
  html.to_html
end

get '/w/api.php' do
  http = Curl.get("http://en.wikipedia.beta.wmflabs.org/w/api.php?#{request.query_string}")
  http.body
end

post '/done' do
  content = request.body.read
  File.write("steps.json", content)
  puts "Content = #{content}"
  json_hash = JSON.parse(content.to_s);
  create_scenario json_hash["steps"]
  `bundle exec ruby automate.rb`
end
