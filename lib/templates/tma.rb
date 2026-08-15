# TMA layer — Telegram Mini App overlay. Applied on top of lib/templates/base.rb,
# never on its own: it patches files that base has already put in place.
#
# Applied from template.rb via `apply` (same generator object, shared ivars).
# Do NOT redefine source_paths here — see the comment in template.rb.

# ---- Gemfile ---------------------------------------------------------------
gem 'rack-cors'

# ---- Static files ----------------------------------------------------------
# Sources are prefixed with 'tma/files/' for the same reason base's are prefixed with
# 'base/files/': `directory` picks exactly one source tree and never merges two.
directory 'tma/files/app/components', 'app/components', force: true
directory 'tma/files/app/controllers', 'app/controllers', force: true
directory 'tma/files/app/views', 'app/views', force: true
directory 'tma/files/app/frontend', 'app/frontend', force: true
directory 'tma/files/app/models', 'app/models', force: true
directory 'tma/files/config/initializers', 'config/initializers', force: true

template 'tma/erb/config/initializers/tg_app.rb.erb', 'config/initializers/tg_app.rb', force: true

# ---- Patches on base files -------------------------------------------------
# Snippets live in the overlay tree rather than inline heredocs so that layer files
# stay declarative (CLAUDE.md: no content in template.rb).
inject_into_file 'config/routes.rb',
                 File.read(find_in_source_paths('tma/snippets/routes_tma.rb')),
                 after: "  # <!-- PRESET_ROUTES -->\n"
inject_into_file 'config/routes.rb',
                 File.read(find_in_source_paths('tma/snippets/routes_api_tma.rb')),
                 after: "      # <!-- PRESET_API_ROUTES -->\n"
gsub_file 'config/routes.rb', 'root to: redirect("/admin")', 'root to: redirect("/tma")'

append_to_file 'app/views/admin/login.html.erb',
               File.read(find_in_source_paths('tma/snippets/login_footer.html.erb'))
append_to_file '.env.example', <<~ENV

  # Telegram
  TG_BOT_TOKEN=#{@bot_token.empty? ? '<paste-from-BotFather>' : @bot_token}
ENV

# ---- Post-bundle ----------------------------------------------------------
# Registered after base's block, so the database already exists and base's migration
# has run by the time this fires.
after_bundle do
  generate :migration, 'CreateUsers telegram_id:bigint:uniq first_name:string last_name:string username:string language_code:string is_premium:boolean photo_url:string'
  rails_command 'db:migrate'

  append_to_file '.env', "TG_BOT_TOKEN=#{@bot_token}\n"
end

@next_steps << ''
@next_steps << "  TMA:   http://localhost:3000/tma     (только через HTTPS-туннель)"
@next_steps << '  cloudflared tunnel --url http://localhost:3000'
@next_steps << '  # → возьми HTTPS URL, в BotFather:'
@next_steps << '  #   /mybots → @YourBot → Bot Settings → Menu Button → URL = https://<tunnel>/tma'
