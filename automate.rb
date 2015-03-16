require 'watir-webdriver'
require 'json'
require 'screenshot'
require 'page-object'
require_relative 'visual_editor_page.rb'


def handle_step page, step, i
	if step["action"] == "click"
		page.send("element_#{i}_element").send("click")
		return nil
	else
		return page.send("element_#{i}_element")
	end
end

ENV['DISPLAY'] = ':10'
json_hash = JSON.parse(File.read("steps.json"))
browser = Watir::Browser.new :firefox
json_hash["languages"].split(',').each do|language|
	browser.goto "http://test2.wikipedia.org/wiki/References?veaction=edit&vehidebetadialog=true&uselang=#{language}"
	page = VisualEditorPage.new(browser)

	i = 0
	screenshot_elements = []
	json_hash["steps"].each do |f|
		unless f["element"].nil?
			screenshot_element = handle_step page, f, i
			screenshot_elements << screenshot_element unless screenshot_element.nil?
			i += 1
		end
	end

	Screenshot.capture(browser, "#{json_hash["title"]}-#{language}.png", screenshot_elements)
end
browser.close