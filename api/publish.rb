#!/usr/bin/env ruby
# Simple Ruby script to handle blog publishing
# This should be run behind proper authentication in production

require 'json'
require 'fileutils'

# Only allow in development
if ENV['JEKYLL_ENV'] != 'development'
  puts "Content-Type: application/json\n\n"
  puts JSON.generate({ error: 'Publishing only allowed in development mode' })
  exit 1
end

begin
  # Git commands to publish
  system('git add .')
  system('git commit -m "Update blog content"')
  result = system('git push origin main')
  
  puts "Content-Type: application/json\n\n"
  if result
    puts JSON.generate({ success: true, message: 'Published successfully' })
  else
    puts JSON.generate({ error: 'Failed to push to repository' })
  end
rescue => e
  puts "Content-Type: application/json\n\n"
  puts JSON.generate({ error: e.message })
end