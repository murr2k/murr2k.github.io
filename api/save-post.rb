#!/usr/bin/env ruby
# Simple Ruby script to handle blog post saving
# This should be run behind proper authentication in production

require 'json'
require 'fileutils'
require 'cgi'

# Only allow in development
if ENV['JEKYLL_ENV'] != 'development'
  puts "Content-Type: application/json\n\n"
  puts JSON.generate({ error: 'Saving only allowed in development mode' })
  exit 1
end

begin
  cgi = CGI.new
  data = JSON.parse(cgi.params['data'][0])
  
  filename = data['filename']
  content = data['content']
  
  # Sanitize filename
  filename = filename.gsub(/[^a-zA-Z0-9\-_.]/, '')
  
  # Ensure _posts directory exists
  FileUtils.mkdir_p('_posts')
  
  # Write the file
  File.write("_posts/#{filename}", content)
  
  puts "Content-Type: application/json\n\n"
  puts JSON.generate({ success: true, message: 'Post saved successfully' })
rescue => e
  puts "Content-Type: application/json\n\n"
  puts JSON.generate({ error: e.message })
end